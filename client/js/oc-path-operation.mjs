/* global customElements, HTMLElement */

import { render, html } from '/assets/vendor/lit-html/lit-html.js'
import { parameters } from '/assets/client/js/oc-parameters.mjs'
import { requestBody } from '/assets/client/js/oc-request-body.mjs'

import '/assets/client/js/oc-foldable.mjs'

const optionalText = (operation, textProperty, lead = false) => {
  // TODO: support commonmark
  if (operation[textProperty]) {
    if (lead) {
      return html`<h4>${operation[textProperty]}</h4>`
    }

    return html`<p class="operation-info ${textProperty}">${operation[textProperty]}</p>`
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
    this.pathItem = pathItem
    this.verb = verb
    this.operation = operation
  }

  render () {
    return render(
      html`
        ${optionalText(this.operation, 'summary', true)}
        ${optionalText(this.operation, 'description')}
        ${externalDocs(this.operation)}
        ${parameters(this.operation)}
        ${requestBody(this.operation)}
      `,
      this
    )
  }

  connectedCallback () {
    this.render()
  }
}

customElements.define('oc-path-operation', OCPathOperation)
