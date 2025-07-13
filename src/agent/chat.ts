import { Model } from './model'
import { MCPMultiClient } from './mcp'
import inquire from 'inquirer'
import { ChatMessage } from './type'

export class ChatSession {
  private model: Model
  private mcp: MCPMultiClient
  private history: ChatMessage[] = []

  constructor(model: Model, mcp: MCPMultiClient) {
    this.model = model
    this.mcp = mcp
  }

  appendHistory(message: ChatMessage) {
    this.history.push(message)
  }

  async handleUserInput(input: string): Promise<string> {
    this.appendHistory({ role: 'user', content: input })
    const messages = this.history.map(({ role, content }) => ({
      role,
      content,
    }))
    // 这里只调用 LLM，可扩展为自动调用 tool
    const output = await this.model.chat(messages)
    this.appendHistory({ role: 'assistant', content: output })
    return output
  }

  getHistory(): ChatMessage[] {
    return this.history
  }

  async start() {
    console.log('输入 exit 退出。')
    while (true) {
      const { userInput } = await inquire.prompt({
        type: 'input',
        name: 'userInput',
        message: '你:',
      })
      if (userInput.trim().toLowerCase() === 'exit') break
      const output = await this.handleUserInput(userInput)
      console.log('AI:', output)
    }
  }
}
