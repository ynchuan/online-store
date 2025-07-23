import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './tools'

export default () => {
  const server = createServer()
  async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
  }
  main().catch((error) => {
    console.error('Server error:', error)
    process.exit(1)
  })
}
