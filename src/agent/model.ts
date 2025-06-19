import OpenAI, { ClientOptions } from 'openai'

export class Model {
  private openai: OpenAI
  private modelName: string

  constructor({ apiKey, baseURL, modelName }: { apiKey: string; baseURL: string; modelName: string }) {
    this.openai = new OpenAI({
      apiKey,
      baseURL,
    } as ClientOptions)
    this.modelName = modelName
  }

  async chat(messages: any[], tools?: any): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages,
      model: this.modelName,
      tools,
    })
    return completion.choices[0]?.message?.content || ''
  }
} 