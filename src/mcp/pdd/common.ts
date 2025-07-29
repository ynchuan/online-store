import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getPddApi } from '../../lib/utils'
import { wxLogin, githubLogin } from '../../lib/login'

export const register = (server: McpServer) => {
  server.tool(
    'pdd.goods.opt.get',
    '查询商品标签列表，详见 https://open.pinduoduo.com/application/document/api?id=pdd.goods.opt.get',
    {
      parent_opt_id: z
        .number()
        .optional()
        .default(0)
        .describe('值=0时为顶点opt_id,通过树顶级节点获取opt树'),
    },
    async ({ parent_opt_id }) => {
      const data = await getPddApi('pdd.goods.opt.get', { parent_opt_id })
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 1) }],
      }
    },
  )
  server.tool(
    'pdd.ddk.rp.prom.url.generate',
    '生成授权备案链接，详见 https://open.pinduoduo.com/application/document/api?id=pdd.ddk.rp.prom.url.generate',
    {
      p_id: z.string().default('43033220_306360862').describe('推广位ID'),
      uid: z.string().default('github_11585769').describe('业务平台的用户id'),
    },
    async ({ p_id, uid }) => {
      const data = await getPddApi('pdd.ddk.rp.prom.url.generate', {
        p_id_list: [p_id],
        channel_type: '10',
        custom_parameters: { uid: 'github_11585769' },
      })
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 1) }],
      }
    },
  )
  server.tool(
    'pdd.goods.cats.get',
    '商品标准类目接口，详见 https://open.pinduoduo.com/application/document/api?id=pdd.goods.opt.get',
    {
      parent_cat_id: z
        .number()
        .optional()
        .default(0)
        .describe('值=0时为顶点cat_id,通过树顶级节点获取cat树'),
    },
    async ({ parent_cat_id }, extra) => {
      const data = await getPddApi('pdd.goods.cats.get', { parent_cat_id })
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 1) }],
      }
    },
  )
  // server.tool(
  //   'wechat.oauth2.getuserinfo',
  //   '微信登录，详见 https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html',
  //   {},
  //   async ({}, extra) => {
  //     const ret = await wxLogin.doLogin()
  //     return { content: [{ type: 'text', text: JSON.stringify(ret, null, 1) }] }
  //   },
  // )
  // server.tool(
  //   'github.oauth2.getuserinfo',
  //   'GITHUB 登录，详见 https://github.com/settings/applications/2990671',
  //   {},
  //   async ({}, extra) => {
  //     const ret = await githubLogin.doLogin()
  //     return { content: [{ type: 'text', text: JSON.stringify(ret, null, 1) }] }
  //   },
  // )
}
