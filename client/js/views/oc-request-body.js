import { html } from '/assets/vendor/lit-html/lit-html.js'
import '/assets/client/js/components/oc-tabbed-content.js'

import { propertyTable } from '/assets/client/js/views/oc-property-table.js'

const contentTypeBody = (contentType, bodyFormat) => html`
  <oc-tabbed-content>
    <h6>${contentType}</h6>

    <ul class="nav nav-pills">
      <li class="nav-item"><a href="" class="oc-tabbed-content-tab nav-link active" data-target="properties">Properties</a></li>
      <li class="nav-item"><a href="" class="oc-tabbed-content-tab nav-link" data-target="examples">Examples</a></li>
      <li class="nav-item"><a href="" class="oc-tabbed-content-tab nav-link" data-target="schema">Schema</a></li>
    </ul>
    <div class="oc-tabbed-content-tab-panel active" data-content="properties">
      ${propertyTable(bodyFormat.schema)}
    </div>
    <div class="oc-tabbed-content-tab-panel" data-content="examples">
      <pre><code class="JSON">${JSON.stringify(bodyFormat.example || bodyFormat.examples, null, 2)}</code></pre>
    </div>
    <div class="oc-tabbed-content-tab-panel" data-content="schema">
      <pre><code class="JSON">${JSON.stringify(bodyFormat.schema, null, 2)}</code></pre>
    </div>
  </oc-tabbed-content>
  `

const requestBodyContent = content => {
  const contentTypes = Object.keys(content)

  return html`
  <oc-request-body-content>
        ${contentTypes.map((contentType) => contentTypeBody(contentType, content[contentType]))}
    </div>
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
