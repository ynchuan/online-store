import { Context, Next } from 'koa'
import {
  verifyAuthorizeToken,
  extractTokenFromHeader,
  isAuthorizeValid,
  AuthorizeInfo,
} from './jwt'

// 扩展Context类型以包含授信信息
declare module 'koa' {
  interface Context {
    creditInfo?: AuthorizeInfo
  }
}

// 授信验证中间件
export const creditAuthMiddleware = async (ctx: Context, next: Next) => {
  try {
    const authHeader = ctx.headers.authorization || ''
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: '缺少授权token',
      }
      return
    }

    // 验证token
    const creditInfo = verifyAuthorizeToken(token)
    if (!creditInfo) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: '无效的授信token',
      }
      return
    }

    // 检查授信是否有效
    if (!isAuthorizeValid(creditInfo)) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: '授信已失效',
      }
      return
    }

    // 将授信信息添加到context中
    ctx.creditInfo = creditInfo

    await next()
  } catch (error) {
    console.error('授信验证中间件错误:', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: '授信验证失败',
    }
  }
}

// 检查授信额度是否足够的中间件
export const checkAuthorizeLimit =
  (requiredAmount: number) => async (ctx: Context, next: Next) => {
    const creditInfo = ctx.creditInfo

    if (!creditInfo) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: '缺少授信信息',
      }
      return
    }

    const remainingAuthorize = creditInfo.creditLimit - creditInfo.creditUsed

    if (remainingAuthorize < requiredAmount) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: `授信额度不足，需要${requiredAmount}，剩余${remainingAuthorize}`,
      }
      return
    }

    await next()
  }
