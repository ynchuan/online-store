import * as crypto from 'crypto'
import fs from "fs"
import { RC_PATH, CLIENT_ID, CLIENT_SECRET, PDD_BASE_URL } from "./const"

export const generateSign = (params: Record<string, any>, clientSecret: string) => {
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
export const setRc = (data: any) => {
  const rc = getRc()
  Object.assign(rc, data)
  fs.writeFileSync(RC_PATH, JSON.stringify(rc, null, 2))
}

export const getRc = () => {
  if (fs.existsSync(RC_PATH)) {
    const data = fs.readFileSync(RC_PATH, 'utf-8')
    return JSON.parse(data)
  } else {
    return {}
  }
}

/**
 * 调用拼多多开放平台官方API
 * @param type API接口名，如"pdd.ddk.goods.search"
 * @param bizParams 业务参数对象
 * @param access_token 用户授权token（可选）
 */
export const getPddApi = async (
  type: string,
  bizParams: Record<string, any>,
  access_token?: string
) => {
  const timestamp = Math.floor(Date.now() / 1000)
  const params: Record<string, any> = {
    type,
    client_id: CLIENT_ID,
    timestamp,
    data_type: "JSON",
    access_token,
    ...bizParams,
  }
  params.sign = generateSign(params, CLIENT_SECRET)
  const res = await fetch(PDD_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return data
}


