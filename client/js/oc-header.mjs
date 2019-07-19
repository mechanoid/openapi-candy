import { fromString } from '/assets/client/js/oc-minitemp.mjs'

export const renderHeader = info => {
  const result = fromString(`<header>
    <h2>${info.title} (${info.version})</h2>
  </header>`)

  if (info.description) {
    const description = fromString(`<p>${info.description}</p>`)
    result.appendChild(description)
  }

  // TODO: render `termsOfService` if available
  // TODO: render `contact` if available
  // TODO: render `license` if available

  return result
}
