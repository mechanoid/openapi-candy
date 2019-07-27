/* global slug */
import { resolveObject } from '/assets/client/js/oc-schema-ref.mjs'
import { html } from '/assets/vendor/lit-html/lit-html.js'
import { pathOperations } from '/assets/client/js/oc-path-operations.mjs'

const additionalInformation = (path, infoType, options = {}) => {
  const info = path[infoType]

  if (info) {
    return html`
      <p class="additional-information ${infoType} ${options.lead ? 'lead' : ''}">
        ${info}
      </p>
    `
  }
}

const pathItem = (pathName, path, options = {}) => {
  const pathData = path.data

  return html`
    <oc-path id="${path.data['x-link-rel']}">
      <div class="card mb-3">
        <div class="card-body">
          <h4>
            <a class="oc-anchor-copy-help" href="#${pathData['x-link-rel']}">
              ${pathData['x-link-rel']} <strong>${pathName}</strong>
            </a>
          </h4>
          ${additionalInformation(pathData, 'summary', { lead: true })}
          ${additionalInformation(pathData, 'description')}
          ${pathOperations(path)}
        </div>
      </div>
    </oc-path>
  `
}

const pathsContainer = (paths, options = {}) => html`
  <oc-paths>${paths}
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
