/**
 * Lodash omit
 */
export function omit(obj, arr) {
  return Object.keys(obj)
    .filter(k => !arr.includes(k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});
}

export const makeAnchorId = id => {
  if (typeof id === 'object') {
    return null;
  }
  if (!id) {
    return null;
  }
  try {
    return id
      .toLowerCase()
      .replace(/\//g, '')
      .replace(/\s/g, '-')
      .replace(/(\(|\))/g, 'aaa')
      .replace(/\./g, '-')
      .replace(/(^[^\u4e00-\u9fa5^a-z%])/, 'n$1');
  } catch (error) {
    return null;
  }
};
