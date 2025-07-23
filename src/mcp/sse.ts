import Router from 'koa-router'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { createServer, getSseTransports } from './tools'

export default (router: Router) => {
  const server = createServer()
  const transports: Record<string, SSEServerTransport> = getSseTransports()
  const POST_ENDPOINT = '/messages'

  router.get('/mcp', async (ctx) => {
    const transport = new SSEServerTransport(POST_ENDPOINT, ctx.res)
    transports[transport.sessionId] = transport
    ctx.req.on('close', () => {
      delete transports[transport.sessionId]
    })
    await server.connect(transport)
    ctx.respond = false // 交由 transport 处理响应
  })

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
}
