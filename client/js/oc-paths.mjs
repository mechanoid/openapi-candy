import { fromString, injectElements } from '/assets/client/js/oc-minitemp.mjs'
import { renderPathOperations } from '/assets/client/js/oc-path-operations.mjs'
import { resolveObject } from '/assets/client/js/oc-schema-ref.mjs'

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

  // TODO: render path generic parameters (https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#fixed-fields-7)
  const operations = renderPathOperations(pathItem)
  result.appendChild(operations)

  return result
}

export const renderPaths = async (paths, options = {}) => {
  const pathItemNames = Object.keys(paths)

  const renderedPathsFutures = pathItemNames.map(async pathItemName => {
    const pathItem = paths[pathItemName]

    const card = fromString(`<div class="card mb-3"></div>`)
    const cardBody = fromString(`<div class="card-body"></div>`)

    console.log(pathItem)
    const resolvedPathItem = await resolveObject(pathItem, {
      baseUrl: options.baseUrl
    })
    console.log(resolvedPathItem)

    const item = renderPathItem(pathItemName, resolvedPathItem)

    card.appendChild(cardBody)
    cardBody.appendChild(item)

    return card
  })

  const result = fromString(`<oc-paths></oc-paths>`)

  const renderedPaths = await Promise.all(renderedPathsFutures)
  injectElements(result, renderedPaths)

  return result
}
