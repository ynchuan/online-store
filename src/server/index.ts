import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'

export default (initRouters: (router: Router) => any) => {
  const router = new Router()
  const cbk = initRouters(router)
  const app = new Koa()
  app.use(bodyparser())
  app.use(cbk ? cbk() : router.routes())
  app.use(router.allowedMethods())
  const main = app.callback()
  const listen = () => {
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.error(
        `MCP ${process.env.TRANSPORT} server running on http://localhost:${PORT}`,
      )
    })
  }
  return {
    main,
    listen,
  }
}
