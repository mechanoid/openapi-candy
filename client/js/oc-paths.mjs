import { resolveObject } from '/assets/client/js/oc-schema-ref.mjs'
import { html } from '/assets/vendor/lit-html/lit-html.js'
import { until } from '/assets/vendor/lit-html/directives/until.js'
import { pathOperations } from '/assets/client/js/oc-path-operations.mjs'
// import { pathOperations } from './oc-path-operations-templates.mjs'

const additionalInformation = (path, infoType, options = {}) => {
  const info = path[infoType]

  if (info) {
    return html`
      <p
        class="additional-information
				${infoType}
				${options.lead ? 'lead' : ''}"
      >
        ${info}
      </p>
    `
  }
}

const pathItem = (pathName, path, options = {}) => {
  const pathData = path.data

  return html`
    <oc-path id="${path['x-link-rel']}">
      <h4>${pathData['x-link-rel']} <strong>${pathName}</strong></h4>
      ${additionalInformation(pathData, 'summary', { lead: true })}
      ${additionalInformation(pathData, 'description')}
      <hr />
      ${pathOperations(path)}
    </oc-path>
  `
}

const pathsContainer = (paths, options = {}) => html`
  <oc-paths>
    <div class="card mb-3">
      <div class="card-body">${paths}</div>
    </div>
  </oc-paths>
`

export const renderPaths = async (pathsConfigs, options = {}) => {
  const pathConfigNames = Object.keys(pathsConfigs)

  const pathFutures = pathConfigNames.map(pathItemName => {
    const pathConfig = pathsConfigs[pathItemName]

    return resolveObject(pathConfig, {
      baseUrl: options.baseUrl
    }).then(path => pathItem(pathItemName, path, path.meta))
  })

  const paths = await Promise.all(pathFutures)

  return pathsContainer(paths, options)
}
