#!/usr/bin/env node
import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { createServer, getSseTransports } from './tools'

export default () => {
  const server = createServer()
  const transports: Record<string, SSEServerTransport> = getSseTransports()
  const POST_ENDPOINT = '/messages'
  const CONNECT_ENDPOINT = '/connect'

  const router = new Router()
  // SSE 连接
  router.get(CONNECT_ENDPOINT, async (ctx) => {
    // 建立 SSE 连接
    const transport = new SSEServerTransport(POST_ENDPOINT, ctx.res)
    transports[transport.sessionId] = transport
    ctx.req.on('close', () => {
      delete transports[transport.sessionId]
    })
    await server.connect(transport)
    ctx.respond = false // 交由 transport 处理响应
  })
  // 处理消息
  router.post(POST_ENDPOINT, async (ctx) => {
    const sessionId = ctx.query.sessionId as string
    const transport = transports[sessionId]
    if (!transport) {
      ctx.status = 400
      ctx.body = { error: 'No transport found for sessionId.' }
      return
    }
    await transport.handlePostMessage(
      ctx.req,
      ctx.res,
      (ctx.request as any).body,
    )
    ctx.respond = false // 交由 transport 处理响应
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
        `MCP SSE server running on http://localhost:${PORT}${CONNECT_ENDPOINT}`,
      )
    })
  }
  return {
    main,
    listen,
  }
}
