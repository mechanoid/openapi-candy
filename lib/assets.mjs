import path from 'path'
import express from 'express'

const assetPrefixPath = '/assets'
const nodeModulePath = path.resolve('node_modules')
const bootstrapPath = path.resolve(nodeModulePath, 'bootstrap', 'dist')
const newAgeThemePath = path.resolve(nodeModulePath, 'startbootstrap-new-age')
const clientAssetPath = path.resolve('client')

export default app => {
  app.use(
    path.join(assetPrefixPath, 'bootstrap'),
    express.static(bootstrapPath)
  )

  app.use(
    path.join(assetPrefixPath, 'new-age-theme'),
    express.static(newAgeThemePath)
  )

  app.use(path.join(assetPrefixPath, 'client'), express.static(clientAssetPath))

  return {
    bootstrap: assetPath => path.join(assetPrefixPath, 'bootstrap', assetPath),
    client: assetPath => path.join(assetPrefixPath, 'client', assetPath),
    newAgeTheme: assetPath =>
      path.join(assetPrefixPath, 'new-age-theme', assetPath)
  }
}
