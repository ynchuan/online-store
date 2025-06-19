import { Model } from './model'
import { MCPMultiClient } from './mcp'
import { ChatSession } from './chat'

async function main() {
  // 1. 初始化 mcp multi client
  const mcp = new MCPMultiClient()
  await mcp.loadConfig('mcp.json')
  await mcp.connectAll()

  // 2. 初始化模型
  const model = new Model({
    apiKey: process.env.DEEPSEEK_API_KEY || '<DeepSeek API Key>',
    baseURL: 'https://api.deepseek.com',
    modelName: 'deepseek-chat',
  })

  // 3. 初始化对话
  const chat = new ChatSession(model, mcp)
  await chat.start()
}

main()
