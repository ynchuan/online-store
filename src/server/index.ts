import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import authrouter from './authorize'
import toolsrouter from './tools'

export default (initRouters: (router: Router) => any) => {
  const mcprouter = new Router()
  const cbk = initRouters(mcprouter)
  const app = new Koa()
  app.use(bodyparser())
  app.use(cbk ? cbk() : mcprouter.routes())
  app.use(authrouter.routes())
  app.use(toolsrouter.routes())
  app.use(mcprouter.allowedMethods())
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
