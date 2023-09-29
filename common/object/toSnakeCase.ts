import { mapKeys } from "./mapKeys"

export const toSnakeCase = (object: unknown) =>
  mapKeys(object, key =>
    key.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`),
  )
