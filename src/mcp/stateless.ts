#!/usr/bin/env node
import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createServer } from './tools'

const unValidedMsg = (msg: string) => ({
  jsonrpc: '2.0',
  error: {
    code: -32000,
    message: msg,
  },
  id: null,
})

export default () => {
  const router = new Router()
  router.post('/mcp', async (ctx) => {
    // 每次请求都新建 server/transport
    const server = createServer()
    const body = (ctx.request as any).body
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless
    })
    ctx.res.on('close', () => {
      transport.close()
      server.close()
    })
    try {
      await server.connect(transport)
      await transport.handleRequest(ctx.req, ctx.res, body)
      ctx.respond = false // 交由 MCP transport 处理响应
    } catch (err) {
      ctx.status = 500
      ctx.body = unValidedMsg('Internal server error')
    }
  })

  // 禁用 GET /mcp，stateless 不支持 SSE/长连接
  router.get('/mcp', async (ctx) => {
    ctx.status = 405
    ctx.body = unValidedMsg('Method not allowed in stateless mode')
  })

  router.get('/', async (ctx) => {
    ctx.body = 'hello stateless mcp'
  })

  const app = new Koa()
  app.use(bodyparser())
  app.use(router.routes())
  app.use(router.allowedMethods())

  const main = app.callback()

  const listen = () => {
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.error(
        `MCP stateless HTTP server running on http://localhost:${PORT}/mcp`,
      )
    })
  }
  return { main, listen }
}
