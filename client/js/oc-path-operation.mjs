import { fromString } from '/assets/client/js/oc-minitemp.mjs'
import { resolveObject } from '/assets/client/js/oc-schema-ref.mjs'

const renderParameterSection = (type, parameters) => {
  if (parameters.length > 0) {
    const paramSection = fromString(`<oc-param-section>
      <h5>${type} parameters</h5>
      <table class="table"><tbody></tbody></table>
    </oc-param-section>`)
    const table = paramSection.querySelector('table')
    const body = table.querySelector('tbody')

    parameters.forEach(param => {
      // TODO: add commonmark rendering for description
      const row = fromString(`<tr>
          <td>${param.name}</td>
          <td>${param.description}</td>
          <td>${param.required ? 'required' : ''}</td>
          <td>${
  param.deprecated
    ? '<span class="badge badge-secondary">deprecated</span>'
    : ''
}</td>
        </tr>`)

      body.appendChild(row)
    })

    table.appendChild(body)

    return paramSection
  }
}
export class OCPathOperation extends HTMLElement {
  constructor (pathItem, verb, operation) {
    super()
    this.pathItem = pathItem.data
    this.baseUrl = pathItem.meta.baseUrl
    this.verb = verb
    this.operation = operation
  }

  async connectedCallback () {
    this.renderSummary()
    this.renderDescription()
    this.renderExternalDocs()
    await this.renderParameters()
  }

  async renderParameters () {
    const parameterConfig = this.operation.parameters
    const result = fromString('<oc-parameters>')

    if (parameterConfig) {
      const parameters = await resolveObject(parameterConfig, {
        baseUrl: this.baseUrl
      })

      const paramTypes = ['header', 'path', 'query', 'cookie']

      paramTypes.forEach(type => {
        const params = parameters.data.filter(p => p.in === type)

        const table = renderParameterSection(type, params)
        if (table) {
          result.appendChild(table)
        }
      })

      this.appendChild(result)
    }
  }

  renderSummary () {
    this.renderOptionalText('summary', true)
  }

  renderDescription () {
    this.renderOptionalText('description')
  }

  renderOptionalText (textProperty, lead = false) {
    // TODO: support commonmark
    if (this.operation[textProperty]) {
      const text = fromString(
        `<p class="operation-info ${textProperty} ${lead ? 'lead' : ''}">${
          this.operation[textProperty]
        }</p>`
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
