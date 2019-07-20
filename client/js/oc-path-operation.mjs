export class OCPathOperation extends HTMLElement {
  constructor (verb, operation) {
    super()
    this.verb = verb
    this.operation = operation
  }

  connectedCallback () {}
}

customElements.define('oc-path-operation', OCPathOperation)
