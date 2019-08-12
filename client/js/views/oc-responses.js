import { html } from '/assets/vendor/lit-html/lit-html.js'
import '/assets/client/js/components/oc-tabbed-content.js'
import { mimeTypes } from '/assets/client/js/views/oc-mime-types.js'
import { parameterSection } from '/assets/client/js/views/oc-parameters.js'

const responseHeaders = headers => {
  if (!headers) { return '' }
  const headerParams = Object.keys(headers)
    .map(headerName => Object.assign({}, headers[headerName], { name: headerName, in: 'header' }))
  return html`
    ${parameterSection(headerParams)}
    `
}

const responseSection = (responseCode, response) => {
  return html`
  <h5>${responseCode}:</h5>
  ${response.description ? html`<p class="">${response.description}</p>` : ''}

  ${response.headers ? html`
    <h6>Header</h6>
    ${responseHeaders(response.headers)}` : ''}

  ${response.content ? html`
    <h6>Content</h6>
    ${mimeTypes(response.content)}` : ''}
  `
}

export const responses = (operation, options = {}) => {
  if (operation.responses) {
    const responses = operation.responses

    return html`
      <oc-responses>

        <h4>Responses</h4>

        ${Object.keys(responses).map(responseCode => responseSection(responseCode, responses[responseCode]))}


      </oc-responses>
    `
  }

  return ''
}
