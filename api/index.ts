#!/usr/bin/env node

import stdio from '../src/mcp/stdio'
import stream from '../src/mcp/stream'
import sse from '../src/mcp/sse'
import stateless from '../src/mcp/stateless'

const starts = {
  stdio: stdio,
  stream: stream,
  sse: sse,
  stateless: stateless,
}

let main
try {
  const trans = process.env.TRANSPORT || 'stateless'
  const res = starts[trans as keyof typeof starts]()
  main = res?.main
  console.error('mcp server started by mode:', trans)
  if (process.env.TRANSPORT) {
    res?.listen()
  }
} catch (error) {
  console.error('Server error:', error)
  process.exit(1)
}
export default main
