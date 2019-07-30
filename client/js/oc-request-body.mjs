import { html } from '/assets/vendor/lit-html/lit-html.js'

const propRequired = (schema, propName) => schema.required && schema.required.indexOf(propName) >= 0

const propertyObject = schema => {
  if (!schema.properties) {
    return {}
  }

  return Object.keys(schema.properties).reduce((result, propName) => {
    const prop = schema.properties[propName]
    result[`${propRequired(schema, propName) ? '*' : ''}${propName}`] = prop.format || prop.type
    return result
  }, {})
}

const contentTypeMenuItem = (contentType, first) => html`
  <li class="nav-item active">
    <a href="" class="nav-link oc-content-type-switch ${first ? 'active' : ''}" target="${contentType}">${contentType}</a>
  </li>`

const contentTypeBody = (contentType, bodyFormat, first) => html`<div class="content-type-body ${first ? 'active' : ''}">
  <pre><code class="JSON">${JSON.stringify(propertyObject(bodyFormat.schema), null, 2)}</code></pre>
</div>`

const requestBodyContent = content => {
  const contentTypes = Object.keys(content)

  return html`
  <oc-request-body-content class="container">
    <div class="row">
      <ul class="nav flex-column col-sm-4 col-lg-2">
        ${contentTypes.map((contentType, index) => contentTypeMenuItem(contentType, index === 0))}
      </ul>
      <div class="oc-request-body-tab-content col-sm-8 col-lg-10">
        ${contentTypes.map((contentType, index) => contentTypeBody(contentType, content[contentType], index === 0))}
      </div>
    </div>
  </oc-request-body-content>`
}

export const requestBody = (operation, options = {}) => {
  if (operation.requestBody) {
    const requestBody = operation.requestBody

    return html`
      <oc-request-body>
        <oc-foldable>
          <header>
            <h5>request body${requestBody.required ? '*' : ''}</h5>
          </header>
          <oc-foldable-container>
            ${requestBody.description ? html`<p class="lead">${requestBody.description}</p>` : ''}
            ${requestBodyContent(requestBody.content)}
          </oc-foldable-container>
        </oc-foldable>
      </oc-request-body>
    `
  }

  return ''
}
