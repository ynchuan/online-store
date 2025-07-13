import fs from 'fs/promises'
import { MCPServerConfig, MCPTool } from './type'

export class MCPMultiClient {
  private servers: MCPServerConfig[] = []
  private tools: MCPTool[] = []

  async loadConfig(path: string): Promise<void> {
    const content = await fs.readFile(path, 'utf-8')
    const config = JSON.parse(content)
    this.servers = Object.entries(config.mcpServers).map(
      ([name, server]: [string, any]) => ({
        name,
        command: server.command,
        args: server.args,
      }),
    )
  }

  getServers(): MCPServerConfig[] {
    return this.servers
  }

  async connectAll(): Promise<void> {
    for (const server of this.servers) {
      // 这里只做演示，实际应 spawn 子进程或远程连接
      console.log(
        `Connecting to MCP server: ${server.name} (${server.command} ${server.args.join(' ')})`,
      )
      // TODO: 实现实际连接逻辑
      // 假设每个 server 返回 tools，模拟如下：
      const mockTools = [
        {
          name: `tool_${server.name}_1`,
          description: `desc1`,
          serverName: server.name,
        },
        {
          name: `tool_${server.name}_2`,
          description: `desc2`,
          serverName: server.name,
        },
      ]
      this.tools.push(...mockTools)
    }
  }

  getTools(): MCPTool[] {
    return this.tools
  }

  findTool(toolName: string): MCPTool | undefined {
    return this.tools.find((t) => t.name === toolName)
  }

  async callTool(toolName: string, params: any): Promise<any> {
    const tool = this.findTool(toolName)
    if (!tool) throw new Error(`Tool not found: ${toolName}`)
    // TODO: 实际调用对应 server 的工具
    return {
      result: `mocked result from ${tool.serverName} for tool ${toolName}`,
    }
  }
}
