import Koa from 'koa'
import Router from 'koa-router'
import {
  CLIENT_ID,
  CLIENT_SECRET,
  LOGIN_URL,
  WX_CLIENT_ID,
  WX_CLIENT_SECRET,
  WX_LOGIN_URL,
  WX_LOGIN_GET_TOKEN,
  WX_LOGIN_GET_INFO,
  PDD_BASE_URL,
  LOGIN_PORT,
  RC_PATH,
  LOGIN_REDIRECT_URI,
} from './const'
import { generateSign, getRc, setRc } from './utils'

type GetTokenByCode = (code: string) => Promise<any>

class BaseLogin {
  token: any
  tokenKey: string
  loginUrl: string
  getTokenByCode: GetTokenByCode
  successMsg: string

  constructor(
    tokenKey: string,
    loginUrl: string,
    getTokenByCode: GetTokenByCode,
    successMsg: string = '登录成功，请关闭页面',
  ) {
    this.tokenKey = tokenKey
    this.token = undefined
    this.loginUrl = loginUrl
    this.getTokenByCode = getTokenByCode
    this.successMsg = successMsg
  }

  getToken() {
    return getRc()[this.tokenKey]
  }
  setToken(data: any) {
    return setRc({ [this.tokenKey]: data })
  }
  clearToken() {
    this.token = ''
    return setRc({ [this.tokenKey]: '' })
  }

  async doLogin() {
    if (!this.token) {
      this.token = this.getToken() || (await this.triggerLogin())
    }
    return this.token
  }

  async triggerLogin(): Promise<any> {
    return new Promise((resolve) => {
      const app = new Koa()
      const router = new Router()
      let server: any
      router.get('/callback', async (ctx) => {
        const { code } = ctx.query
        const tokenData = await this.getTokenByCode(code as string)
        this.setToken(tokenData)
        ctx.body = this.successMsg
        resolve(tokenData)
        setTimeout(() => server.close(), 1000)
      })
      app.use(router.routes())
      app.use(router.allowedMethods())
      server = app.listen(LOGIN_PORT)
      // const { default: open } = await import('open')
      // open(this.loginUrl)
    })
  }
}

export const pddLogin = new BaseLogin(
  'pdd_token',
  LOGIN_URL,
  async (code: string) => {
    const timestamp = Date.now()
    const params = {
      type: 'pdd.pop.auth.token.create',
      data_type: 'JSON',
      client_id: CLIENT_ID,
      code,
      timestamp,
    }
    const sign = generateSign(params, CLIENT_SECRET)
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const res = await fetch(`${PDD_BASE_URL}?${queryString}&sign=${sign}`)
    const data = await res.json()
    return data.pop_auth_token_create_response
  },
)

export const wxLogin = new BaseLogin(
  'wx_token',
  WX_LOGIN_URL,
  async (code: string) => {
    const params = {
      appid: WX_CLIENT_ID,
      secret: WX_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const res = await fetch(`${WX_LOGIN_GET_TOKEN}?${queryString}`)
    return await res.json()
  },
  '微信登录成功，请关闭页面',
)

export const githubLogin = new BaseLogin(
  'github_token',
  `https://github.com/login/oauth/authorize?client_id=${'Ov23liUM3HbSFE9QWrer'}&redirect_uri=${encodeURIComponent(LOGIN_REDIRECT_URI)}`,
  async (code: string) => {
    const params = {
      client_id: 'Ov23liUM3HbSFE9QWrer',
      client_secret: '946dba1a1551289acaa3a9f2b5348dcf3623189e',
      code,
    }
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    const data = await res.json()
    const user = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        Accept: 'application/json',
      },
    })
    const userData = await user.json()
    return { ...data, user: userData }
  },
  'Github登录成功，请关闭页面',
)
