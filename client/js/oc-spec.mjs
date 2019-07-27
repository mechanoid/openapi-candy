/* global HTMLElement, customElements, fetch */

import { render, html } from '/assets/vendor/lit-html/lit-html.js'
import { baseUrl } from '/assets/client/js/oc-url-helper.mjs'

import { renderPaths } from '/assets/client/js/oc-paths.mjs'
import { until } from '/assets/vendor/lit-html/directives/until.js'

const menuItems = paths =>
  Object.keys(paths).map(pathName => {
    const path = paths[pathName]

    return html`
      <li>
        <a href="#${path['x-link-rel']}">${path['x-link-rel']}</a>
      </li>
    `
  })

const menu = spec => html`
  <ul class="nav flex-column">
    ${menuItems(spec.data.paths)}
  </ul>
`

// TODO: render `termsOfService` if available
// TODO: render `contact` if available
// TODO: render `license` if available
const specHeader = info => html`
  <header>
    <h2>${info.title} (${info.version})</h2>
    ${info.description
    ? html`
          <p>${info.description}</p>
        `
    : ''}
  </header>
`

const content = (spec, meta) => html`
  ${specHeader(spec.data.info)}
  ${until(renderPaths(spec.data.paths, meta), 'resolving pathes')}
`

const specContainer = (spec, meta) => html`
  <div class="row">
    <div class="oc-spec-menu col-sm-3 col-md-2">${menu(spec)}</div>
    <div class="oc-spec-content col-sm-9 col-md-10">${content(spec, meta)}</div>
  </div>
`

const loadSpec = async specPath =>
  fetch(specPath)
    .then(res => {
      if (!res.ok) {
        throw new Error(`spec file could not be retrieved: ${res}`)
      }
      return res
    })
    .then(res => res.json())
    .then(res => ({
      data: res,
      baseUrl: baseUrl(specPath)
    }))

class OpenAPICandySpec extends HTMLElement {
  async connectedCallback () {
    try {
      const spec = await this.spec()

      await this.render(spec)
    } catch (e) {
      console.log(e)
    }
  }

  async spec () {
    if (this._spec) {
      return this._spec
    }

    const specPath = this.getAttribute('href')

    if (!specPath) {
      throw new Error('no spec-file defined')
    }

    this._spec = await loadSpec(specPath)
    return this._spec
  }

  async render (spec) {
    const meta = { baseUrl: spec.baseUrl }

    render(specContainer(spec, meta), this)
  }
}

customElements.define('oc-spec', OpenAPICandySpec)
