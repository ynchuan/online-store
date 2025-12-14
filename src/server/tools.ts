import { ParameterizedContext } from 'koa'
import Router from 'koa-router'
import { createServer } from '../mcp/server'

const router = new Router({ prefix: '/tools' })
const server: any = createServer()

router.get('/', async (ctx: ParameterizedContext) => {
  const { toolName, ...args } = ctx?.query as any
  try {
    if (toolName) {
      const tools: any = server._registeredTools
      const params = Object.keys(args).reduce((acc: any, item: any) => {
        acc[item] = JSON.parse(args[item])
        return acc
      }, {})
      const result = await tools[toolName].callback(params)
      ctx.body = { code: 0, data: result, msg: 'success' }
    } else {
      const result = Object.entries(server._registeredTools).reduce(
        (acc: any, item: any) => {
          acc[item[0]] = item[1].description
          return acc
        },
        {},
      )
      ctx.body = { code: 0, data: result, msg: 'success' }
    }
  } catch (error: any) {
    ctx.body = { code: -1, data: [], msg: error.message }
  }
})

export default router
