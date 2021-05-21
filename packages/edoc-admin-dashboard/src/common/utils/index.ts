export function calculatePagination(current: number, pageSize: number) {
  return {
    limit: pageSize,
    offset: (current - 1) * pageSize
  };
}

export function isEmpty(value: string | undefined | null, cb?: Function): boolean {
  if (typeof value !== 'string') {
    typeof cb === 'function' && cb();
    return true;
  }
  if (!value) {
    typeof cb === 'function' && cb();
  }
  return !value;
}