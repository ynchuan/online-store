#!/usr/bin/env node

import stdio from './stdio'
import stream from './stream'
import sse from './sse'
import stateless from './stateless'

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
} catch (error) {
  console.error('Server error:', error)
  process.exit(1)
}
export default main
