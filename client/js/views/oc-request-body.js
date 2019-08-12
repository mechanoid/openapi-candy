import { html } from '/assets/vendor/lit-html/lit-html.js'
import { mimeTypes } from '/assets/client/js/views/oc-mime-types.js'

const requestBodyContent = content => {
  return html`
  <oc-request-body-content>
    <h5>Content-Type</h5>
    ${mimeTypes(content)}
  </oc-request-body-content>`
}

export const requestBody = (operation, options = {}) => {
  if (operation.requestBody) {
    const requestBody = operation.requestBody

    return html`
      <oc-request-body>
        <header>
          <h4>request body${requestBody.required ? '*' : ''}</h4>
        </header>
        ${requestBody.description ? html`<p class="lead">${requestBody.description}</p>` : ''}
        ${requestBodyContent(requestBody.content)}
      </oc-request-body>
    `
  }

  return ''
}
