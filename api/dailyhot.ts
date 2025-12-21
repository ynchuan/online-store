// @ts-ignore - dailyhot-api doesn't export app directly, but we can access it
import serveHotApi from 'dailyhot-api'
import app from 'dailyhot-api/dist/app.js'

export default async (req: Request) => {
  return app.fetch(req)
}
