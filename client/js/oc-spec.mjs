import { render } from '/assets/client/js/oc-minitemp.mjs'
import { header } from '/assets/client/js/oc-header.mjs'

const loadSpec = async specPath =>
  fetch(specPath)
    .then(res => {
      console.log('fetched')
      if (!res.ok) {
        throw new Error(`spec file could not be retrieved: ${res}`)
      }
      return res
    })
    .then(res => res.json())

const debug = spec => {
  return render(`<pre>${JSON.stringify(spec, false, 2)}</pre>`)
}

class OpenAPICandySpec extends HTMLElement {
  async connectedCallback () {
    try {
      const spec = await this.spec()

      this.render(spec)
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

  render (spec) {
    this.append(header(spec.info))
    this.append(debug(spec))
  }
}

customElements.define('oc-spec', OpenAPICandySpec)
