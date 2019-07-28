/* global customElements, HTMLElement */

import { render, html } from '/assets/vendor/lit-html/lit-html.js'
import { until } from '/assets/vendor/lit-html/directives/until.js'
import { parameters } from '/assets/client/js/oc-parameters.mjs'
import { requestBody } from '/assets/client/js/oc-request-body.mjs'

import '/assets/client/js/oc-foldable.mjs'

const optionalText = (operation, textProperty, lead = false) => {
  // TODO: support commonmark
  if (operation[textProperty]) {
    return html`<p class="operation-info ${textProperty} ${lead ? 'lead' : ''}">
        ${operation[textProperty]}
      </p>`
  }
  return ''
}

const externalDocs = operation => {
  // TODO: support commonmark for text
  const extDocs = operation.externalDocs

  if (extDocs) {
    return html`<div class="oc-callout oc-callout-info">
        <a href="${extDocs.url}" target="”_blank”" rel="”noopener" noreferrer”>
          ${extDocs.url}
        </a>
      </div>`
  }

  return ''
}

export class OCPathOperation extends HTMLElement {
  constructor (pathItem, verb, operation) {
    super()
    this.pathItem = pathItem.data
    this.baseUrl = pathItem.meta.baseUrl
    this.verb = verb
    this.operation = operation
  }

  async render () {
    return render(
      html`
        ${optionalText(this.operation, 'summary', true)}
        ${optionalText(this.operation, 'description')}
        ${externalDocs(this.operation)}
        ${until(
    parameters(this.operation, { baseUrl: this.baseUrl }),
    'loading parameters'
  )}
        ${until(
    requestBody(this.operation, { baseUrl: this.baseUrl }),
    'loading request body'
  )}
      `,
      this
    )
  }

  async connectedCallback () {
    await this.render()
  }
}

customElements.define('oc-path-operation', OCPathOperation)
