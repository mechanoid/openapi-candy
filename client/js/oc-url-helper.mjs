export const origin = () => {
  const location = window.location

  if (location.origin) {
    return location.origin
  }

  return `${location.protocol}//${location.host}`
}

export const baseUrl = urlString => {
  const url = new URL(urlString, origin())

  if (url.origin) {
    return url.origin
  }

  return `${url.protocol}//${url.host}`
}
