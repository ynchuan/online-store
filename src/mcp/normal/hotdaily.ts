import { z } from 'zod'

// 获取所有可用的接口列表
export const getAvailableRoute = async () => {
  try {
    const response = await fetch('https://dailyhot.ynchuan.asia/all')
    const data = await response.json()
    return data.routes
  } catch (error) {
    return []
  }
}

// 注册函数
export const register = async (server: any) => {
  server.tool(
    'get_available_routes',
    '获取所有可用的媒体热搜数据',
    {},
    async () => {
      try {
        const data = await getAvailableRoute()
        const text = data
          .filter((route: any) => route.path !== null)
          .map((route: any) => route.name)
          .join('\n')
        return {
          content: [{ type: 'text', text }],
        }
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: error.message }],
        }
      }
    },
  )
  server.tool(
    'get_hot_data',
    '获取指定媒体热搜数据，媒体渠道是 `get_available_routes` 中返回的媒体渠道值',
    {
      names: z
        .array(z.string())
        .nonempty('至少需要提供一个接口名称')
        .describe('接口名称数组，如: zhihu, weibo, bilibili 等'),
    },
    async ({ names }: { names: string[] }) => {
      // 获取热搜数据
      const results = await Promise.all(
        names.map(async (name: string) => {
          try {
            const response = await fetch(
              `https://dailyhot.ynchuan.asia/${name}`,
            )
            const data = await response.json()
            return `${name} ${data.title} 更新时间：${data.updateTime}\n${data.data
              .map((item: any) => `- 标题：${item.title} 链接：${item.url}`)
              .join('\n')}`
          } catch (error) {
            return `${name} 未获取到热搜数据`
          }
        }),
      )
      return { content: [{ type: 'text', text: results.join('\n\n') }] }
    },
  )
}
