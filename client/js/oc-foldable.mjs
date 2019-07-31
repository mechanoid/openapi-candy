/* global HTMLElement, customElements */

class OCFoldable extends HTMLElement {
  connectedCallback () {
    this.header.addEventListener('click', e => {
      this.classList.toggle('show')
    })
  }

  get header () {
    if (this._headline) {
      return this._headline
    }

    this._headline = this.querySelector('header')
    return this._headline
  }

  get foldable () {
    if (this._foldable) {
      return this._foldable
    }

    this._foldable = this.querySelector('oc-foldable-container')
    return this._foldable
  }
}

// customElements.define('oc-foldable', OCFoldable)
