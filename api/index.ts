#!/usr/bin/env node

import stdio from '../src/mcp/stdio'
import stream from '../src/mcp/stream'
import sse from '../src/mcp/sse'
import stateless from '../src/mcp/stateless'
import server from '../src/server'
import { logger } from '../src/lib/utils'

const starts: any = {
  stdio: stdio,
  stream: stream,
  sse: sse,
  stateless: stateless,
}

let ret
try {
  process.env.TRANSPORT = process.env.TRANSPORT || 'stateless'
  const trans = process.env.TRANSPORT
  if (trans === 'stdio') {
    starts.stdio()
  } else {
    const initRouter = starts[trans]
    const { main, listen } = server(initRouter)
    ret = main
    logger.error('mcp server started by mode:', trans)
    if (process.env.TRANSPORT) {
      listen()
    }
  }
} catch (error) {
  logger.error('Server error:', error)
  process.exit(1)
}
export default ret
