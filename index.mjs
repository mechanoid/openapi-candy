import express from 'express'
import app from './lib/app.mjs'
import assetLoader from './lib/assets.mjs'

const assets = assetLoader(app)

app.use('/specs', express.static('./specs'))

// TODO: add specPath to path params

app.get('/', (req, res) => {
  const currentLinkRel = req.query.linkRel
  const specPath = req.query.spec
  const content = {
    specPath: specPath || 'specs/petstore-example.3.0.json'
  }

  res.render('index', { content, assets, currentLinkRel })
})

export default app
