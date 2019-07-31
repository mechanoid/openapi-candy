/* global customElements, HTMLElement */
import { html } from '/assets/vendor/lit-html/lit-html.js'

const propRequired = (schema, propName) => schema.required && schema.required.indexOf(propName) >= 0

// TODO: duplicate from parameters
const badge = (param, text, options = {}) => {
  const classes = options.classes ? options.classes : ''
  return param
    ? html`<span class="badge badge-secondary ${classes}">${text}</span>`
    : ''
}

const propertyRow = (schema, propName, prop) => html`
  <tr>
    <td>${propName}</td>
    <td>${prop.description}</td>
    <td>${prop.format || prop.type}${prop.default ? prop.default : ''}</td>
    <td>
      ${propRequired(schema, propName) ? badge(true, 'required') : ''}
    </td>
  </tr>
`

const propertyTable = schema => {
  if (!schema.properties) {
    return ''
  }

  return html`
    <table class="table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Description</th>
          <th>Type/Format (Default)</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        ${Object.keys(schema.properties).map(propName => propertyRow(schema, propName, schema.properties[propName]))}
      </tbody>
    </table>
  `
}

// const contentTypeMenuItem = (contentType, first) => html`
//   <li class="nav-item active">
//     <a href="" class="nav-link oc-content-type-switch ${first ? 'active' : ''}" data-target="${contentType}">${contentType}</a>
//   </li>`

const contentTypeBody = (contentType, bodyFormat) => html`
  <oc-request-body-content-type>
    <h6>${contentType}</h6>

    <ul class="nav nav-pills">
      <li class="nav-item"><a href="" class="oc-content-type-tab nav-link active" data-target="properties">Properties</a></li>
      <li class="nav-item"><a href="" class="oc-content-type-tab nav-link" data-target="examples">Examples</a></li>
      <li class="nav-item"><a href="" class="oc-content-type-tab nav-link" data-target="schema">Schema</a></li>
    </ul>
    <div class="oc-content-type-tab-panel active" data-content="properties">
      ${propertyTable(bodyFormat.schema)}
    </div>
    <div class="oc-content-type-tab-panel" data-content="examples">
      <pre><code class="JSON">${JSON.stringify(bodyFormat.example || bodyFormat.examples, null, 2)}</code></pre>
    </div>
    <div class="oc-content-type-tab-panel" data-content="schema">
      <pre><code class="JSON">${JSON.stringify(bodyFormat.schema, null, 2)}</code></pre>
    </div>
  </oc-request-body-content-type>
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

class RequestBodyContentType extends HTMLElement {
  connectedCallback () {
    this.tabs = this.querySelectorAll('.oc-content-type-tab')
    this.panels = this.querySelectorAll('.oc-content-type-tab-panel')

    this.tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault()
        this.tabs.forEach(tab => tab.classList.remove('active'))
        this.panels.forEach(panel => panel.classList.remove('active'))

        const target = tab.getAttribute('data-target')
        const selectedPanel = this.querySelector(`[data-content="${target}"]`)
        tab.classList.add('active')
        selectedPanel.classList.add('active')
      })
    })
  }
}

customElements.define('oc-request-body-content-type', RequestBodyContentType)
