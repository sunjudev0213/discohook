import { first } from "./first"
import { isString } from "./isString"
import type { Validator } from "./Validator"

export const isDate: Validator = first(isString, (value, key) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}?Z$/.test(value as string)
    ? []
    : [`${key}: Must be date in ISO 8601 format`],
)
