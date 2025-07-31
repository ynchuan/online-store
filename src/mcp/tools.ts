import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { register as registerGoods } from './pdd/goods'
import { register as registerCommon } from './pdd/common'
import { register as registerGood } from './pdd/recommand'
import { register as registerHotDaily } from './normal/hotdaily'
import { register as registerMeituan } from './normal/meituan'

export const createServer = () => {
  const server = new McpServer({
    name: 'mcp-online-store',
    version: '1.0.0',
  })
  registerGoods(server)
  registerCommon(server)
  registerGood(server)
  registerHotDaily(server)
  registerMeituan(server)
  return server
}

export const getSseTransports = () => {
  const transports: Record<string, SSEServerTransport> = {}
  return transports
}

export const getStreamTransports = () => {
  const transports: Record<string, StreamableHTTPServerTransport> = {}
  return transports
}

export const getStdioTransports = () => {
  const transports: Record<string, StdioServerTransport> = {}
  return transports
}
