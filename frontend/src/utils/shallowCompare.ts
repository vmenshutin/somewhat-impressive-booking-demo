export const shallowCompare = <T extends object>(left: T, right: T): boolean =>
  (Object.keys(left) as (keyof T)[]).every((key) => left[key] === right[key]);
