export const render = html => {
  const container = document.createElement('DIV')
  container.innerHTML = html
  return container.firstChild
}
