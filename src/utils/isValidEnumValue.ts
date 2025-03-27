export const isValidEnumValue = <T extends object>(enumObj: T, value: string): boolean => {
  return Object.values(enumObj).includes(value as T[keyof T]);
}