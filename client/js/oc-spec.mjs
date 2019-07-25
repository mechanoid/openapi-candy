import { fromString } from '/assets/client/js/oc-minitemp.mjs'
import { renderHeader } from '/assets/client/js/oc-header.mjs'
import { renderPaths } from '/assets/client/js/oc-paths.mjs'
import { baseUrl } from '/assets/client/js/oc-url-helper.mjs'

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

const renderDebug = spec => {
  return fromString(`<pre>${JSON.stringify(spec, false, 2)}</pre>`)
}

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

    const container = fromString(`<div class="row">
			<div class="oc-spec-menu col-sm-3 col-md-2"></div>
			<div class="oc-spec-content col-sm-9 col-md-10"></div>
		</div>`)

    const menu = container.querySelector('.oc-spec-menu')
    const content = container.querySelector('.oc-spec-content')
    const menuItemList = fromString('<ul class="nav flex-column"></ul>')

    const paths = spec.data.paths

    if (paths) {
      Object.keys(paths).forEach(pathName => {
        const path = paths[pathName]
        const menuItem = fromString(`<li>
						<a href="#${path['x-link-rel']}">${path['x-link-rel']}</a>
					</li>`)
        menuItemList.appendChild(menuItem)
      })
      menu.appendChild(menuItemList)
    }

    content.append(renderHeader(spec.data.info))
    content.append(await renderPaths(spec.data.paths, meta))
    // content.append(renderDebug(spec))

    this.appendChild(container)
  }
}

customElements.define('oc-spec', OpenAPICandySpec)
