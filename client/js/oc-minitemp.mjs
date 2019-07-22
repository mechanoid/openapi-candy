export const fromString = html => {
  const container = document.createElement('template')
  container.innerHTML = html.trim()
  return container.content.firstChild
}

export const concatHTML = htmlElements =>
  htmlElements.map(el => el.outerHTML).join('\n')

export const injectElements = (target, htmlElements) =>
  htmlElements.forEach(el => target.appendChild(el))
