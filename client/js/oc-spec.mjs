const loadSpec = async specPath =>
  fetch(specPath)
    .then(res => {
      if (!res.ok) {
        throw new Error(`spec file could not be retrieved: ${res}`)
      }
      return res
    })
    .then(res => res.json())

class OpenAPICandySpec extends HTMLElement {
  async connectedCallback () {
    try {
      const spec = await this.spec()
      console.log(spec)
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
    return spec
  }

  render () {}
}

customElements.define('oc-spec', OpenAPICandySpec)
