import Router from 'koa-router'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createServer } from './tools'
import { unValidedMsg, logger } from '../lib/utils'

export default (router: Router) => {
  router.post('/mcp', async (ctx) => {
    logger.info('stateless mcp request: ', {
      url: ctx.url,
      query: ctx.query,
      headers: ctx.headers,
    })
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
    ctx.status = 200
    ctx.body = unValidedMsg('Method not allowed in stateless mode')
  })

  router.get('/', async (ctx) => {
    ctx.body = 'hello stateless mcp'
  })
}
