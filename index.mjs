import path from 'path'
import express from 'express'
import app from './lib/app.mjs'
import assetLoader from './lib/assets.mjs'

const assets = assetLoader(app)

app.use('/specs', express.static('./specs'))

app.get('/', (req, res) => {
  const content = {
    specPath: 'specs/petstore-example.3.0.json'
  }

  res.render('index', { content, assets })
})

export default app
