function isObject(value) {
  return typeof value === 'object' && value !== null;
}

function emptyPageMeta(total) {
  return {
    current_page: 1,
    last_page: 1,
    per_page: total || 10,
    total,
  };
}

function readPageMeta(value) {
  return {
    current_page: Number(value.current_page ?? 1),
    last_page: Number(value.last_page ?? 1),
    per_page: Number(value.per_page ?? 10),
    total: Number(value.total ?? 0),
    from: value.from,
    to: value.to,
  };
}

export function getData(payload) {
  if (isObject(payload) && 'data' in payload && !Array.isArray(payload.data)) {
    const inner = payload.data;
    if (isObject(inner) && 'data' in inner && Array.isArray(inner.data)) {
      return inner;
    }
    return inner;
  }
  return payload;
}

export function getList(payload) {
  const data = getData(payload);
  if (Array.isArray(data)) {
    return data;
  }
  if (isObject(data) && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
}

export function getPage(payload) {
  const root = payload;
  if (isObject(root) && Array.isArray(root.data) && isObject(root.meta)) {
    return {
      data: root.data,
      meta: readPageMeta(root.meta),
      links: isObject(root.links) ? root.links : undefined,
    };
  }
  if (isObject(root) && 'data' in root) {
    const inner = root.data;
    if (isObject(inner) && Array.isArray(inner.data) && isObject(inner.meta)) {
      return {
        data: inner.data,
        meta: readPageMeta(inner.meta),
        links: isObject(inner.links) ? inner.links : undefined,
      };
    }
    if (Array.isArray(inner)) {
      return { data: inner, meta: emptyPageMeta(inner.length) };
    }
  }
  if (Array.isArray(root)) {
    return { data: root, meta: emptyPageMeta(root.length) };
  }
  return { data: [], meta: emptyPageMeta(0) };
}
