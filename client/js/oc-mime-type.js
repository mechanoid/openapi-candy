/* global customElements, HTMLElement */

class MimeType extends HTMLElement {
  connectedCallback () {
    this.tabs = this.querySelectorAll('.oc-mime-type-tab')
    this.panels = this.querySelectorAll('.oc-mime-type-tab-panel')

    this.tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault()
        this.tabs.forEach(tab => tab.classList.remove('active'))
        this.panels.forEach(panel => panel.classList.remove('active'))

        const target = tab.getAttribute('data-target')
        const selectedPanel = this.querySelector(`[data-content="${target}"]`)
        tab.classList.add('active')
        selectedPanel.classList.add('active')
      })
    })
  }
}

customElements.define('oc-mime-type', MimeType)
