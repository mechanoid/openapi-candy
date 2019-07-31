import { html } from '/assets/vendor/lit-html/lit-html.js'

import { pathOperations } from '/assets/client/js/oc-path-operations.mjs'
import { apiResourceLink } from '/assets/client/js/uri-templates.mjs'

const additionalInformation = (path, infoType, options = {}) => {
  const info = path[infoType]

  if (info) {
    return html`
      <p class="additional-information ${infoType} ${options.lead ? 'lead' : ''}">
        ${info} ${options.join}
      </p>
    `
  }
}

const pathItem = (pathName, path, options = {}) => {
  const pathData = path

  return html`
    <oc-path id="${path['x-link-rel']}">
      <div class="card mb-3">
        <div class="card-body">
          <h3>
            <a class="oc-anchor-copy-help" href="${apiResourceLink({ spec: options.specPath, linkRel: pathData['x-link-rel'] })}">
              ${pathData.summary}
            </a>
          </h3>
          ${additionalInformation(pathData, 'x-link-rel', { lead: true, join: `- ${pathName}` })}
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

export const renderPaths = (pathsConfigs, options = {}) => {
  const pathConfigNames = Object.keys(pathsConfigs)

  const paths = pathConfigNames.map(pathItemName => {
    const path = pathsConfigs[pathItemName]

    return pathItem(pathItemName, path, Object.assign({}, path.meta, { specPath: options.specPath }))
  })

  return pathsContainer(paths, options)
}
