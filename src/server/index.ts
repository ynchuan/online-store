import Koa, { Context } from 'koa'
import Router from 'koa-router'
import * as crypto from 'crypto'

const app = new Koa()
const router = new Router()

const client_id = 'f84eef25feed43f18785014633a0380e'
const client_secret = 'eb08e66896b4296105029d4d21c973734ee93738'

function generateSign(params: Record<string, any>, clientSecret: string) {
    // 1. 所有参数首字母ASCII升序排序
    const sortedKeys = Object.keys(params).sort()
    // 2. 按照 key+value 拼接
    let str = ''
    for (const key of sortedKeys) {
        str += key + params[key]
    }
    // 3. 前后拼接 client_secret
    const signStr = clientSecret + str + clientSecret
    // 4. MD5 并转大写
    return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase()
}

router.get('/hello', async (ctx: Context) => {
    ctx.body = 'Hello, world!'
})

// https://jinbao.pinduoduo.com/open.html?response_type=code&client_id=f84eef25feed43f18785014633a0380e&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=wxx

router.get('/callback', async (ctx) => {
    const { code } = ctx.query
    const timestamp = Date.now()
    // 所有请求参数
    const params = {
        type: 'pdd.pop.auth.token.create',
        data_type: 'JSON',
        client_id,
        code,
        timestamp
    }
    const sign = generateSign(params, client_secret)
    const url = `https://gw-api.pinduoduo.com/api/router?type=${params.type}&data_type=${params.data_type}&client_id=${params.client_id}&code=${params.code}&timestamp=${params.timestamp}&sign=${sign}`
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    ctx.body = data
})

app.use(router.routes())
app.use(router.allowedMethods())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
