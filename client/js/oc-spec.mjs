class OpenAPICandySpec extends HTMLElement {
  connectedCallback () {
    console.log('OpenAPICandySpec connected')
  }
}

customElements.define('oc-spec', OpenAPICandySpec)
