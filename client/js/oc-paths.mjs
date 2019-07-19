import { render, injectElements } from '/assets/client/js/oc-minitemp.mjs'
import { renderPathOperations } from '/assets/client/js/oc-path-operations.mjs'

export const renderPathItem = (pathItemName, pathItem) => {
  const result = render(`<article>
    <h3>${pathItem['x-link-rel']}</h3>
  </article>`)

  const operations = renderPathOperations(pathItem)
  result.appendChild(operations)

  return result
}

export const renderPaths = paths => {
  const pathItemNames = Object.keys(paths)

  const renderedPaths = pathItemNames.map(pathItemName => {
    const card = render(`<div class="card mb-3"></div>`)
    const cardBody = render(`<div class="card-body"></div>`)

    const item = renderPathItem(pathItemName, paths[pathItemName])

    card.appendChild(cardBody)
    cardBody.appendChild(item)

    return card
  })

  const result = render(`<oc-paths></oc-paths>`)

  injectElements(result, renderedPaths)

  return result
}
