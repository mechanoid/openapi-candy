import { html } from '/assets/vendor/lit-html/lit-html.js'

const contentTypeMenuItem = contentType => html`
  <li class="nav-item active">
    <a class="nav-link oc-content-type-switch" target="${contentType}">${contentType}</a>
  </li>`

const contentTypeBody = (contentType, bodyFormat) => html`<div>${contentType}</div>`

const requestBodyContent = content => {
  const contentTypes = Object.keys(content)

  return html`
  <oc-request-body-content class="container">
    <div class="row">

      <ul class="nav nav-pills flex-column col-md-4">
        ${contentTypes.map(contentType => contentTypeMenuItem(contentType))}
      </ul>
      <div class="oc-spec-content col-md-8">
        ${contentTypes.map(contentType => contentTypeBody(contentType, content[contentType]))}
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
          <oc-foldable-containerDISABLED>
            ${requestBody.description ? html`<p class="lead">${requestBody.description}</p>` : ''}
            ${requestBodyContent(requestBody.content)}
            <pre>${JSON.stringify(requestBody.content, null, 2)}<pre>
          </oc-foldable-containerDISABLED>
        </oc-foldable>
      </oc-request-body>
    `
  }

  return ''
}
