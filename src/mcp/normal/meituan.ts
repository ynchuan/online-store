import { z } from 'zod'

// 获取美团热门推荐数据
const getMeituanHotRecommend = async (cityId: string = '1') => {
  try {
    const url = `https://apimobile.meituan.com/group/v1/deal/searchpage/hotword/city/divide/hotrecommend/1?homeBusinessAreaId=673&dynamicTemplate=1&cateId=-1&supportSplitHistory=2&refreshType=discovery%2Crecommend&locCityid=${cityId}&entrance=1&homeCreateTime=${Date.now()}&search_accessibility=0&searchLongTermControl=rest_flow&homePageAddressFromLocate=1&homePagePos=40.0196119%2C116.4679146&utm_medium=android&utm_term=1200390203&version_name=12.39.203&userid=-1&p_appid=10&csecplatform=1&csecversionname=12.39.203&csecpkgname=com.sankuai.meituan&csecversion=1.0.0.55`
    const defaultCookie =
      'AgHlJUPST0mt6GkOT4YEQvxeeutVZrNHTCTHn3NUen6uBksODi_xzJEyjsr9IoeM5dfOlBP8R_di4AAAAAAzKwAALuUr7LOcwWLInHrhxWF7Qai2_1yzMI4wEZFIgvU2ALMeGRz0Hk_yjmuaxAZj-LHf'
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Cookie: defaultCookie, // 如需支持外部传入 cookie，可将 defaultCookie 替换为参数
      },
    })
    const data = await response.json()
    return data.data?.segmentsV2?.find(
      (item: any) => item.template === 'searchRank',
    )?.hotwordSegments
  } catch (error) {
    console.error('获取美团热门推荐失败:', error)
    return null
  }
}

// 获取美团美食排行榜数据
const getMeituanFoodRank = async (
  cityId: string = '1',
  cateId: string = '1',
) => {
  try {
    const url = `https://apimeishi.meituan.com/meishi/search/homepage/foodRank?cityId=${cityId}&userid=-1&requestor=mrn&mypos=40.0196119%2C116.4679156&districtId=&cateId=${cateId}&locCityId=${cityId}&wtt_region_version=&cn_pt=RN&utm_source=meituaninternaltest&utm_medium=android&utm_term=1200390203`
    const response = await fetch(url)
    const data = await response.json()
    return data?.data?.ranks
  } catch (error) {
    console.error('获取美团美食排行榜失败:', error)
    return null
  }
}

// 注册函数
export const register = async (server: any) => {
  server.tool(
    'get.meituan.hot.recommend',
    '获取美团热门推荐数据',
    {
      cityId: z.string().optional().describe('城市ID，默认为1（北京）'),
    },
    async ({ cityId = '1' }: { cityId?: string }) => {
      try {
        const data = await getMeituanHotRecommend(cityId)
        if (data && Array.isArray(data)) {
          const result =
            `美团热门推荐 (城市ID: ${cityId})\n` +
            data
              .map(
                (item: any) =>
                  `- ${item.title}\n${item.items.map((it: any) => it.query).join('\n')}`,
              )
              .join('\n\n')
          return {
            content: [{ type: 'text', text: result }],
          }
        } else {
          return {
            content: [{ type: 'text', text: '未获取到美团热搜数据' }],
          }
        }
      } catch (error: any) {
        return {
          content: [
            { type: 'text', text: `获取美团热门推荐失败: ${error.message}` },
          ],
        }
      }
    },
  )

  server.tool(
    'get.meituan.food.rank',
    '获取美团美食排行榜数据',
    {
      cityId: z.string().optional().describe('城市ID，默认为1（北京）'),
      cateId: z.string().optional().describe('分类ID，默认为1（美食）'),
    },
    async ({
      cityId = '1',
      cateId = '1',
    }: {
      cityId?: string
      cateId?: string
    }) => {
      try {
        const data = await getMeituanFoodRank(cityId, cateId)
        if (data && Array.isArray(data)) {
          const text =
            `美团美食排行榜 (城市ID: ${cityId}, 分类ID: ${cateId})\n` +
            data
              .map((item: any) => {
                return `${item.title} 热搜榜\n${item.items.map((it: any) => `${it.name}`).join('\n')}`
              })
              .join('\n\n')
          return {
            content: [{ type: 'text', text }],
          }
        } else {
          return {
            content: [{ type: 'text', text: '获取美团美食排行榜数据失败' }],
          }
        }
      } catch (error: any) {
        return {
          content: [
            { type: 'text', text: `获取美团美食排行榜失败: ${error.message}` },
          ],
        }
      }
    },
  )
}
