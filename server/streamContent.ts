import { Transform } from 'node:stream'
import { Request, Response, NextFunction } from 'express'
import { ABORT_DELAY, HTML_KEY } from './constants'
import type { render } from '../src/entry-server'

export type StreamContentArgs = {
  render: typeof render
  html: string
  req: Request
  res: Response
  next: NextFunction
}

export function streamContent({ render, html, res }: StreamContentArgs) {
  let renderFailed = false

  const { pipe, abort } = render({
    onShellError() {
      res.status(500).set({ 'Content-Type': 'text/html' }).send('<pre>Something went wrong</pre>')
    },
    onShellReady() {
      res.status(renderFailed ? 500 : 200).set({ 'Content-Type': 'text/html' })

      const [htmlStart, htmlEnd] = html.split(HTML_KEY)
      res.write(htmlStart)

      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          res.write(chunk, encoding)
          callback()
        },
      })

      transformStream.on('finish', () => {
        res.end(htmlEnd)
      })

      pipe(transformStream)
    },
    onError(error) {
      renderFailed = true
      console.error((error as Error).stack)
    },
  })

  setTimeout(abort, ABORT_DELAY)
}
