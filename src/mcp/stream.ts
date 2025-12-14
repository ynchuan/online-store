import Router from 'koa-router'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { randomUUID } from 'crypto'
import { createServer, getStreamTransports } from './server'
import { unValidedMsg, logger } from '../lib/utils'

const isInited = (body: any) =>
  Array.isArray(body)
    ? body.some((item: any) => item?.method === 'initialize')
    : body?.method === 'initialize'

export default (router: Router) => {
  const server = createServer()
  const transports = getStreamTransports()

  router.post('/mcp', async (ctx) => {
    const sessionId = ctx.headers['mcp-session-id'] as string | undefined
    let transport: StreamableHTTPServerTransport
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
    ctx.body = 'hello streamable mcp'
  })
}
