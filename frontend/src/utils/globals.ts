export function isClass(type: unknown): boolean {
  return (
    typeof type === 'function' &&
    typeof type.prototype === 'object' &&
    type.prototype.constructor === type
  );
}

export function isClassInstance(type: unknown): boolean {
  return !!type && typeof type === 'object' && type.constructor !== Object;
}
