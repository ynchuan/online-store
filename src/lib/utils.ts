import * as crypto from 'crypto'
import fs from "fs"
import { isEmpty, isObject } from "lodash"
import { RC_PATH, CLIENT_ID, CLIENT_SECRET, PDD_BASE_URL } from "./const"
import { pddLogin } from "./login"

export const generateSign = (params: Record<string, any>, clientSecret: string) => {
  const str = Object.keys(params).sort().reduce((str, key) => {
    const value = params[key]
    str += key + value
    return str
  }, '')
  const signStr = clientSecret + str + clientSecret
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

const adapterBizParams = (bizParams: any) => {
  Object.keys(bizParams).forEach((key) => {
    const value = bizParams[key]
    if (isObject(value)) {
      if (isEmpty(value)) {
        delete bizParams[key]
      } else {
        bizParams[key] = JSON.stringify(value)
      }
    }
  })
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
): Promise<any> => {
  const token = await pddLogin.doLogin()
  const access_token = token.access_token
  const timestamp = Math.floor(Date.now() / 1000)
  adapterBizParams(bizParams)
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
  if (data?.error_response?.error_code === 10019) {
    pddLogin.clearToken()
    return getPddApi(type, bizParams)
  }
  return data
}