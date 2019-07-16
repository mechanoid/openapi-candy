#!/usr/bin/env node --experimental-modules

import dotenv from 'dotenv'
import app from '../index.mjs'
dotenv.config()

const server = app.listen(process.env.PORT, () => {
  console.log('server started, and listens to:', server.address().port)
})
