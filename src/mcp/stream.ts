#!/usr/bin/env node
import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { randomUUID } from 'crypto'
import { createServer, getStreamTransports } from './tools'

export default () => {
  const server = createServer()
  const transports = getStreamTransports()

  const isInited = (body: any) =>
    Array.isArray(body)
      ? body.some((item: any) => item?.method === 'initialize')
      : body?.method === 'initialize'
  const unValidedMsg = (msg: string) => ({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: msg,
    },
    id: null,
  })

  const router = new Router()
  router.post('/mcp', async (ctx) => {
    const sessionId = ctx.headers['mcp-session-id'] as string | undefined
    let transport: StreamableHTTPServerTransport
    // 断言 any 以消除类型报错
    const body = (ctx.request as any).body
    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId]
    } else {
      if (isInited(body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid) => (transports[sid] = transport),
        })
        transport.onclose = () => {
          if (transport.sessionId) delete transports[transport.sessionId]
        }
        await server.connect(transport)
      } else {
        ctx.status = 400
        ctx.body = unValidedMsg('Bad Request: No valid session ID provided')
        return
      }
    }
    await transport.handleRequest(ctx.req, ctx.res, body)
    ctx.respond = false // 交由 MCP transport 处理响应
  })
  router.get('/mcp', async (ctx) => {
    const sessionId = ctx.headers['mcp-session-id'] as string | undefined
    if (!sessionId || !transports[sessionId]) {
      ctx.status = 400
      ctx.body = unValidedMsg('Invalid or missing session ID')
      return
    }
    const transport = transports[sessionId]
    await transport.handleRequest(ctx.req, ctx.res)
    ctx.respond = false // 交由 MCP transport 处理响应
  })
  router.get('/', async (ctx) => {
    ctx.body = 'helle'
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
        `MCP HTTP streamable server running on http://localhost:${PORT}/mcp`,
      )
    })
  }
  return {
    main,
    listen,
  }
}
