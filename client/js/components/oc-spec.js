/* global HTMLElement, customElements, hljs, SmoothScroll, window */

import { render } from '/assets/vendor/lit-html/lit-html.js'

import { loadSchema } from '/assets/client/js/util/oc-schema-ref.js'
import { componentsByCategory } from '/assets/client/js/oc-components.js'
import { specLayout } from '/assets/client/js/views/oc-main-menu.js'

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
    console.log(JSON.stringify(spec, 0, 2))
    const meta = { specPath: this.specPath, currentLinkRel: this.currentLinkRel }

    const components = componentsByCategory(spec.components, meta)
    // console.log(JSON.stringify(spec, null, 2))
    render(specLayout(spec, components, meta), this)

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
