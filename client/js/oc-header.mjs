import { render } from '/assets/client/js/oc-minitemp.mjs'

export const header = info => {
  const result = render(`<header>
    <h2>${info.title} (${info.version})</h2>
  </header>`)

  if (info.description) {
    const description = render(`<p>${info.description}</p>`)
    result.appendChild(description)
  }

  // TODO: render `termsOfService` if available
  // TODO: render `contact` if available
  // TODO: render `license` if available

  return result
}
