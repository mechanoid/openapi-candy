import { html } from '/assets/vendor/lit-html/lit-html.js'
import { resolveObject } from '/assets/client/js/oc-schema-ref.mjs'

export const requestBody = async (operation, options = {}) => {
  if (operation.requestBody) {
    const requestBody = await resolveObject(operation.requestBody, options)

    const rbData = requestBody.data
    return html`
      <oc-request-body>
        <oc-foldable>
          <header>
            <h5>request body${rbData.required ? '*' : ''}</h5>
          </header>
          <oc-foldable-container>
            ${rbData.description ? html`<p class="lead">${rbData.description}</p>` : ''}
            <pre>${JSON.stringify(rbData.content, null, 2)}<pre>
          </oc-foldable-container>
        </oc-foldable>
      </oc-request-body>
    `
  }

  return ''
}
