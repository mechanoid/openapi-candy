/* global HTMLElement, customElements, hljs, SmoothScroll, window */

import { render, html } from '/assets/vendor/lit-html/lit-html.js'

import { loadSchema } from '/assets/client/js/oc-schema-ref.mjs'
import { renderPaths } from '/assets/client/js/oc-paths.mjs'
import { apiResourceLink } from '/assets/client/js/uri-templates.mjs'

const menuItems = (paths, options = {}) =>
  Object.keys(paths).map(pathName => {
    const path = paths[pathName]

    return html`
      <li>
        <a class="main-nav-link ${options.currentLinkRel === path['x-link-rel'] ? 'active' : ''}" href="
          ${apiResourceLink({ spec: options.specPath, linkRel: path['x-link-rel'] })}
        ">
          ${path.summary || path['x-link-rel']}
          ${path.summary && path['x-link-rel'] ? html`<span class="oc-main-nav-link-summary">${path['x-link-rel']}</span>` : ''}
        </a>
      </li>
    `
  })

const menu = (spec, options = {}) => html`
  <ul class="oc-main-menu nav flex-column  col-md-3 col-lg-2">
    ${menuItems(spec.paths, options)}
  </ul>
`

// TODO: render `termsOfService` if available
// TODO: render `contact` if available
// TODO: render `license` if available
const specHeader = info => html`
  <header class="spec-header">
    <h2>${info.title} (${info.version})</h2>
    ${info.description
    ? html`<p>${info.description}</p>`
    : ''}
  </header>
`

const content = (spec, meta) => html`
  ${specHeader(spec.info)}
  ${renderPaths(spec.paths, meta)}
`

const specContainer = (spec, meta) => html`
  <div class="row">
    <div class="oc-spec-menu col-md-3 col-lg-2">${menu(spec, meta)}</div>
    <div class="oc-spec-content col-md-9 col-lg-10">${content(spec, meta)}</div>
  </div>
`
const resolveSpec = async specPath => {
  if (!specPath) {
    throw new Error('no spec-file defined')
  }

  return loadSchema(specPath)
}

class OpenAPICandySpec extends HTMLElement {
  async connectedCallback () {
    try {
      const spec = await resolveSpec(this.specPath)

      this.render(spec)
    } catch (e) {
      console.log(e)
    }
  }

  get currentLinkRel () {
    return this.getAttribute('current-link-rel')
  }

  get specPath () {
    return this.getAttribute('href')
  }

  render (spec) {
    const meta = { specPath: this.specPath, currentLinkRel: this.currentLinkRel }

    // console.log(JSON.stringify(spec, null, 2))
    render(specContainer(spec, meta), this)

    // hljs.initHighlightingOnLoad()
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })

    const hash = window.location.hash

    if (hash) {
      const hashName = hash.slice(1)
      const scroll = new SmoothScroll()

      const elem = document.querySelector(`[id="${hashName}"]`)
      scroll.animateScroll(elem, null, { offset: 150 })
    }
  }
}

customElements.define('oc-spec', OpenAPICandySpec)
