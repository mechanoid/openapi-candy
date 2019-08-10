import { html } from '/assets/vendor/lit-html/lit-html.js'
import '/assets/client/js/oc-tabbed-content.js'

const response = (code, response) => html`<tr>
  <td>${code}</td>
  <td>${response.description}</td>
  <td>${response.schema && response.schema.title}</td>
</tr>`

export const responses = (operation, options = {}) => {
  if (operation.responses) {
    const responses = operation.responses

    return html`
      <oc-responses>

        <h5>Responses</h5>
        <table class="table">
          <thead>
            <th>Code</th>
            <th>Description</th>
            <th>Schema</th>
          </thead>
          <tbody>
            ${Object.keys(responses).map(code => response(code, responses[code]))}
          </tbody>
        </table>
      </oc-responses>
    `
  }

  return ''
}
