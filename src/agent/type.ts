// 通用类型定义

export interface MCPServerConfig {
    name: string;
    command: string;
    args: string[];
}

export interface MCPTool {
    name: string;
    description?: string;
    inputSchema?: any;
    serverName: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
} 