import Koa from 'koa'
import Router from 'koa-router'
import { CLIENT_ID, CLIENT_SECRET, LOGIN_URL, PDD_BASE_URL, LOGIN_PORT, RC_PATH } from './const'
import { generateSign, getRc, setRc } from './utils'
import open from 'open'

class Login {
  getToken() {
    return getRc().token
  }
  setToken(data: any) {
    return setRc({ token: data })
  }
  doLogin() {
    const token = this.getToken()
    if (token) {
      return token
    } else {
      const p = this.loginCallback()
      open(LOGIN_URL)
      debugger
      return p
    }
  }
  loginCallback() {
    return new Promise((resolve, reject) => {
      const app = new Koa()
      const router = new Router()
      let server: any
      router.get('/callback', async (ctx) => {
        const { code } = ctx.query
        const timestamp = Date.now()
        const params = { type: 'pdd.pop.auth.token.create', data_type: 'JSON', client_id: CLIENT_ID, code, timestamp }
        const sign = generateSign(params, CLIENT_SECRET)
        const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
        const res = await fetch(`${PDD_BASE_URL}?${queryString}&sign=${sign}`)
        const data = await res.json()
        this.setToken(data.pop_auth_token_create_response)
        ctx.body = "登录成功，请关闭页面"
        resolve(data)
        setTimeout(() => server.close(), 1000)
      })
      app.use(router.routes())
      app.use(router.allowedMethods())
      server = app.listen(LOGIN_PORT)
    })
  }
}
export default new Login()
