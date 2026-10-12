export function getStats(data, role) {
  if (!data) {
    return [];
  }
  if (data.stats && data.stats.length > 0) {
    return data.stats;
  }
  const stats = [];
  if (role?.slug === 'admin') {
    if (data.total_tickets !== undefined) {
      stats.push({ label: 'Total tickets', value: data.total_tickets, key: 'total' });
    }
    if (data.agents !== undefined) {
      stats.push({ label: 'Agents', value: data.agents, key: 'agents' });
    }
    if (data.by_status.open !== undefined) {
      stats.push({ label: 'Open', value: data.by_status.open ?? 0, key: 'open' });
    }
    if (data.by_status.in_progress !== undefined) {
      stats.push({ label: 'In progress', value: data.by_status.in_progress ?? 0, key: 'in_progress' });
    }
    if (data.by_status.closed !== undefined) {
      stats.push({ label: 'Closed', value: data.by_status.closed ?? 0, key: 'closed' });
    }
  } else if (role?.slug === 'agent') {
    if (data.assigned_tickets !== undefined) {
      stats.push({ label: 'Assigned to me', value: data.assigned_tickets, key: 'assigned' });
    }
    if (data.by_status.open !== undefined) {
      stats.push({ label: 'Open queue', value: data.by_status.open ?? 0, key: 'open' });
    }
  } else {
    if (data.my_tickets !== undefined) {
      stats.push({ label: 'My tickets', value: data.my_tickets, key: 'my' });
    }
    if (data.by_status.open !== undefined) {
      stats.push({ label: 'Open', value: data.by_status.open ?? 0, key: 'open' });
    }
  }
  return stats;
}

export function getStatusChart(data) {
  if (!data) {
    return [];
  }
  if (data.by_status && data.by_status.length > 0) {
    return data.by_status;
  }
  const list = [];
  if (data.by_status.open !== undefined) {
    list.push({ name: 'Open', value: data.by_status.open ?? 0 });
  }
  if (data.by_status.in_progress !== undefined) {
    list.push({ name: 'In Progress', value: data.by_status.in_progress ?? 0 });
  }
  if (data.by_status.resolved !== undefined) {
    list.push({ name: 'Resolved', value: data.by_status.resolved ?? 0 });
  }
  if (data.by_status.closed !== undefined) {
    list.push({ name: 'Closed', value: data.by_status.closed ?? 0 });
  }
  return list.filter((item) => item.value > 0);
}

export function getPriorityChart(data) {
  if (!data) {
    return [];
  }
  if (data.by_priority && data.by_priority.length > 0) {
    return data.by_priority;
  }
  const list = [];
  if (typeof data.by_priority === 'number') {
    list.push({ name: 'Low', value: data.by_priority.low ?? 0 });
  }
  if (typeof data.by_priority === 'number') {
    list.push({ name: 'Medium', value: data.by_priority.medium ?? 0 });
  }
  if (typeof data.by_priority === 'number') {
    list.push({ name: 'High', value: data.by_priority.high ?? 0 });
  }
  return list.filter((item) => item.value > 0);
}
