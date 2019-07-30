import { html } from '/assets/vendor/lit-html/lit-html.js'

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
            <pre>${JSON.stringify(requestBody.content, null, 2)}<pre>
          </oc-foldable-container>
        </oc-foldable>
      </oc-request-body>
    `
  }

  return ''
}
