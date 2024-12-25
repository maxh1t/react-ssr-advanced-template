import express from 'express'
import { PROD, APP_PORT } from './constants'
import { setupProd } from './prod'
import { setupDev } from './dev'
import { streamContent } from './streamContent'

export async function createServer() {
  const app = express()

  if (PROD) {
    await setupProd(app, streamContent)
  } else {
    await setupDev(app, streamContent)
  }

  app.listen(APP_PORT, () => {
    console.log(`http://localhost:${APP_PORT}`)
  })
}

createServer()