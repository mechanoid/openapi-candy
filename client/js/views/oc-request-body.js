/* global btoa */

import { html } from '/assets/vendor/lit-html/lit-html.js'
import '/assets/client/js/components/oc-tabbed-content.js'

import { propertyTable } from '/assets/client/js/views/oc-property-table.js'

const tabLink = (text, target, options = {}) => html`<li class="nav-item">
    <a href="" class="nav-link ${options.active ? 'active' : ''} ${options.tabClass || 'oc-tabbed-content-tab'}" data-target="${target}">${text}</a>
  </li>`

const mimeTypeBody = mimeType => html`
  <oc-tabbed-content>
    <ul class="nav nav-pills">
      ${tabLink('Properties', 'properties', { active: true })}
      ${tabLink('Examples', 'examples')}
      ${tabLink('Schema', 'schema')}
    </ul>
    <div class="oc-tabbed-content-tab-panel active" data-content="properties">
      ${propertyTable(mimeType.schema)}
    </div>
    <div class="oc-tabbed-content-tab-panel" data-content="examples">
      <pre><code class="JSON">${JSON.stringify(mimeType.example || mimeType.examples, null, 2)}</code></pre>
    </div>
    <div class="oc-tabbed-content-tab-panel" data-content="schema">
      <pre><code class="JSON">${JSON.stringify(mimeType.schema, null, 2)}</code></pre>
    </div>
  </oc-tabbed-content>
  `

const mimeType = (mimeTypeName, mimeType, id, options = {}) => html`
  <oc-mime-type class="${options.panelClass} ${options.active ? 'active' : ''}" data-content="${id}">
    <h6>${mimeTypeName}</h6>
    ${mimeTypeBody(mimeType)}
  </oc-mime-type>
`

const mimeTypes = (mimeTypes, body) => html`
<oc-tabbed-content tab-selector=".oc-mime-tab" panel-selector=".oc-mime-panel" class="row">
  <ul class="nav flex-column nav-pills col-md-3">
    ${Object.keys(mimeTypes)
    .map((mimeTypeName, index) =>
      tabLink(mimeTypeName, btoa(mimeTypeName), { active: index === 0, tabClass: 'oc-mime-tab' }))}
  </ul>

  <div class="flex-column nav-pills col-md-9">
    ${Object.keys(mimeTypes)
    .map((mimeTypeName, index) =>
      mimeType(mimeTypeName, mimeTypes[mimeTypeName], btoa(mimeTypeName), { active: index === 0, panelClass: 'oc-mime-panel' }))}
  </div>
</oc-tabbed-content>
`

const requestBodyContent = content => {
  return html`
  <oc-request-body-content>
    ${mimeTypes(content)}

  </oc-request-body-content>`
}

export const requestBody = (operation, options = {}) => {
  if (operation.requestBody) {
    const requestBody = operation.requestBody

    return html`
      <oc-request-body>
        <header>
          <h5>request body${requestBody.required ? '*' : ''}</h5>
        </header>
        ${requestBody.description ? html`<p class="lead">${requestBody.description}</p>` : ''}
        ${requestBodyContent(requestBody.content)}
      </oc-request-body>
    `
  }

  return ''
}
