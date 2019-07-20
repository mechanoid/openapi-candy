import { fromString, injectElements } from '/assets/client/js/oc-minitemp.mjs'
import { renderPathOperations } from '/assets/client/js/oc-path-operations.mjs'

const appendAdditionalInformation = (
  infoType,
  pathItem,
  renderer,
  options = {}
) => {
  const info = pathItem[infoType]

  if (info) {
    const rendered = fromString(
      `<p class="additional-information ${infoType}">${info}</p>`
    )

    if (options.lead) {
      rendered.classList.add('lead')
    }

    renderer.appendChild(rendered)
  }
}

export const renderPathItem = (pathItemName, pathItem) => {
  const result = fromString(`<article>
    <h4>${pathItem['x-link-rel']} <strong>${pathItemName}</strong></h4>
  </article>`)

  appendAdditionalInformation('summary', pathItem, result, { lead: true })
  appendAdditionalInformation('description', pathItem, result)

  const operations = renderPathOperations(pathItem)
  result.appendChild(operations)

  return result
}

export const renderPaths = paths => {
  const pathItemNames = Object.keys(paths)

  const renderedPaths = pathItemNames.map(pathItemName => {
    const card = fromString(`<div class="card mb-3"></div>`)
    const cardBody = fromString(`<div class="card-body"></div>`)

    const item = renderPathItem(pathItemName, paths[pathItemName])

    card.appendChild(cardBody)
    cardBody.appendChild(item)

    return card
  })

  const result = fromString(`<oc-paths></oc-paths>`)

  injectElements(result, renderedPaths)

  return result
}
