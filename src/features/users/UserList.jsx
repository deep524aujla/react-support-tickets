import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table';
import { UserForm } from '@/features/users/UserForm';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/features/users/useUsers';
import { usePagination } from '@/hooks/usePagination';
import { getError } from '@/utils/errors';
import { useAuth } from '@/features/auth/useAuth';

export function UserList() {
  const { page, perPage, setPage } = usePagination();
  const filters = { page, per_page: perPage };
  const { data, isLoading, isError, error } = useUsers(filters);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const createAction = useCreateUser(() => setCreateOpen(false));
  const updateAction = useUpdateUser(editUser?.id, () => setEditUser(null));
  const deleteAction = useDeleteUser();

  const users = data?.data ?? [];
  const meta = data?.meta;
  const {user:currentUser} = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="text-sm text-slate-600">Manage accounts and roles</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New user
        </Button>
      </div>

      {isError ? (
        <p className="text-sm text-red-600" role="alert">
          {getError(error)}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : null}

      {!isLoading && users.length === 0 ? (
        <EmptyState title="No users" description="Create the first user account." />
      ) : null}

      {!isLoading && users.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role?.slug ?? 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" aria-label="Edit user" onClick={() => setEditUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {currentUser?.id !== user.id && 
                      <Button variant="ghost" aria-label="Delete user" onClick={() => setDeleteId(user.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                         }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {meta ? (
            <Pagination page={meta.current_page} lastPage={meta.last_page} total={meta.total} onPageChange={setPage} />
          ) : null}
        </>
      ) : null}

      <Modal open={createOpen} title="New user" onClose={() => setCreateOpen(false)}>
        <UserForm
          isSubmitting={createAction.isPending}
          serverError={createAction.error}
          onSubmit={(formData) => createAction.mutate(formData)}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal open={Boolean(editUser)} title="Edit user" onClose={() => setEditUser(null)}>
        {editUser ? (
          <UserForm
            initial={editUser}
            isEdit
            isSubmitting={updateAction.isPending}
            serverError={updateAction.error}
            onSubmit={(formData) => updateAction.mutate(formData)}
            onCancel={() => setEditUser(null)}
          />
        ) : null}
      </Modal>

      <ConfirmModal
        open={deleteId !== null}
        title="Delete user"
        message="Remove this user permanently?"
        confirmLabel="Delete"
        isLoading={deleteAction.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId !== null) {
            deleteAction.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
          }
        }}
      />
    </div>
  );
}
