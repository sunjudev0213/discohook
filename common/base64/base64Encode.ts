export const base64Encode = (utf8: string) => {
  if (typeof window === "undefined") {
    return Buffer.from(utf8, "utf8").toString("base64")
  }

  const encoded = encodeURIComponent(utf8)

  const escaped = encoded.replace(/%[\dA-F]{2}/g, hex => {
    return String.fromCharCode(Number.parseInt(hex.slice(1), 16))
  })

  return btoa(escaped)
}
