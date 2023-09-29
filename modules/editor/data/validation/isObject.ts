import type { Validator } from "./Validator"

export const isObject: Validator = (value, key) =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Date)
    ? []
    : [`${key}: Must be object`]
