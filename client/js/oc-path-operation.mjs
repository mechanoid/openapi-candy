import { fromString } from '/assets/client/js/oc-minitemp.mjs'

export class OCPathOperation extends HTMLElement {
  constructor (verb, operation) {
    super()
    this.verb = verb
    this.operation = operation
  }

  connectedCallback () {
    this.renderSummary()
    this.renderDescription()
    this.renderExternalDocs()
  }

  renderSummary () {
    this.renderOptionalText('summary')
  }

  renderDescription () {
    this.renderOptionalText('description')
  }

  renderOptionalText (textProperty) {
    // TODO: support commonmark
    if (this.operation[textProperty]) {
      const text = fromString(
        `<p class="operation-info ${textProperty}">${this.operation[textProperty]}</p>`
      )
      this.appendChild(text)
    }
  }

  renderExternalDocs () {
    // TODO: support commonmark for text
    const externalDocsItem = this.operation.externalDocs
    const externalDocs = fromString(
      `<div class="oc-callout oc-callout-info"></div>`
    )

    if (externalDocsItem) {
      if (externalDocsItem.description) {
        const description = fromString(`<p>${externalDocsItem.description}</p>`)
        externalDocs.appendChild(description)
      }

      const link = fromString(
        `<a href="${externalDocsItem.url}" target=”_blank” rel=”noopener noreferrer”>${externalDocsItem.url}<\a>`
      )
      externalDocs.appendChild(link)

      this.appendChild(externalDocs)
    }
  }
}

customElements.define('oc-path-operation', OCPathOperation)
