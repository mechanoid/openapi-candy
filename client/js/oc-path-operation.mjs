/* global customElements, HTMLElement */

import { render, html } from '/assets/vendor/lit-html/lit-html.js'
import { until } from '/assets/vendor/lit-html/directives/until.js'
import { resolveObject } from '/assets/client/js/oc-schema-ref.mjs'
import '/assets/client/js/oc-foldable.mjs'

const badge = (param, text, options = {}) => {
  const classes = options.classes ? options.classes : ''
  return param
    ? html`<span class="badge badge-secondary ${classes}">${text}</span>`
    : ''
}

// TODO: handle allowEmpty for params
const parameterSection = (type, parameters) => {
  if (parameters.length > 0) {
    // TODO: add commonmark rendering for description

    const paramRows = parameters.map(
      param => html`
        <tr>
          <td><span class="oc-param-name">${param.name}</span></td>
          <td>${param.description}</td>
          <td>
            ${badge(param.required, 'required', { classes: 'badge-primary' })}
            ${badge(param.deprecated, 'deprecated', { classes: 'badge-warning' })}
          </td>
          <td>
            ${param.example ? html`<pre class="oc-param-example">${param.example}</pre>` : ''}
          </td>
        </tr>
      `
    )

    return html`
      <oc-param-section>
        <oc-foldable>
          <header>
            <h5>${type} parameters</h5>
          </header>
          <oc-foldable-container>
            <table class="table">
              <tbody></tbody>
              <thead>
                <th>parameter</th>
                <th colspan="2"></th>
                <th>example</th>
              </thead>
              <tbody>
                ${paramRows}
              </tbody>
            </table>
          </oc-foldable-container>
        </oc-foldable>
      </oc-param-section>
    `
  }

  return ''
}

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

const parameters = async (operation, options = {}) => {
  const parameterConfig = operation.parameters

  if (parameterConfig) {
    const parameters = await resolveObject(parameterConfig, options)

    const paramTypes = ['header', 'path', 'query', 'cookie']

    const paramTables = paramTypes.map(type => {
      const params = parameters.data.filter(p => p.in === type)

      return parameterSection(type, params)
    })

    return html`
      <oc-parameters>${paramTables}</oc-parameters>
    `
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
      `,
      this
    )
  }

  async connectedCallback () {
    await this.render()
  }
}

customElements.define('oc-path-operation', OCPathOperation)
