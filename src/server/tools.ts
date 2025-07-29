import Router from 'koa-router'
import { createServer } from '../mcp/tools'

const router = new Router({ prefix: '/tools' })
const server: any = createServer()

if (router && server && (server as any).tools) {
  server.tools.forEach((tool: any, toolName: string) => {
    router.get(`/${toolName}`, async (ctx: any) => {
      try {
        if (typeof tool.call === 'function') {
          const result = await tool.call(server, ctx.query)
          ctx.body = result
        } else {
          ctx.body = { error: 'Tool does not have a callable interface.' }
        }
      } catch (err: any) {
        ctx.body = { error: err?.message || 'Tool execution error.' }
      }
    })
  })
}

export default router
