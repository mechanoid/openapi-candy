export const render = html => {
  const container = document.createElement('DIV')
  container.innerHTML = html
  return container.firstChild
}

export const concatHTML = htmlElements =>
  htmlElements.map(el => el.outerHTML).join('\n')

export const injectElements = (target, htmlElements) =>
  htmlElements.forEach(el => target.appendChild(el))
