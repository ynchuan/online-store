import Router from 'koa-router'
import {
  generateAuthorizeToken,
  verifyAuthorizeToken,
  isAuthorizeValid,
  extractTokenFromHeader,
  AuthorizeInfo,
} from '../lib/jwt'

const router = new Router({ prefix: '/authorize' })

// 授信接口 - 生成授信token
router.get('/', async (ctx) => {
  try {
    const {
      userId,
      creditLimit,
      creditUsed = 0,
      creditStatus = 'active',
      expiresAt,
    } = (ctx.request.body || ctx.request.query) as any

    // 验证必要参数
    if (!userId || !creditLimit || !expiresAt) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: '缺少必要参数: userId, creditLimit, expiresAt',
      }
      return
    }

    // 创建授信信息
    const creditInfo: AuthorizeInfo = {
      userId,
      creditLimit: Number(creditLimit),
      creditUsed: Number(creditUsed),
      creditStatus,
      expiresAt: new Date(expiresAt),
    }

    // 生成授信token
    const token = generateAuthorizeToken(creditInfo)

    ctx.body = {
      success: true,
      data: {
        token,
        creditInfo,
      },
      message: '授信token生成成功',
    }
  } catch (error) {
    console.error('生成授信token失败:', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: '生成授信token失败',
    }
  }
})

// 检查授信有效性接口
router.get('/verify', async (ctx) => {
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
    const isValid = isAuthorizeValid(creditInfo)

    ctx.body = {
      success: true,
      data: {
        isValid,
        creditInfo,
        remainingAuthorize: creditInfo.creditLimit - creditInfo.creditUsed,
      },
      message: isValid ? '授信有效' : '授信无效',
    }
  } catch (error) {
    console.error('验证授信失败:', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: '验证授信失败',
    }
  }
})

// 更新授信使用额度接口
router.put('/usage', async (ctx) => {
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

    const { amount } = ctx.request.body as any

    if (!amount || amount <= 0) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: '无效的使用额度',
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
      ctx.status = 400
      ctx.body = {
        success: false,
        message: '授信已失效',
      }
      return
    }

    // 检查额度是否足够
    if (creditInfo.creditUsed + amount > creditInfo.creditLimit) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: '授信额度不足',
      }
      return
    }

    // 更新使用额度
    const updatedAuthorizeInfo: AuthorizeInfo = {
      ...creditInfo,
      creditUsed: creditInfo.creditUsed + amount,
    }

    // 生成新的token
    const newToken = generateAuthorizeToken(updatedAuthorizeInfo)

    ctx.body = {
      success: true,
      data: {
        token: newToken,
        creditInfo: updatedAuthorizeInfo,
        remainingAuthorize:
          updatedAuthorizeInfo.creditLimit - updatedAuthorizeInfo.creditUsed,
      },
      message: '授信使用额度更新成功',
    }
  } catch (error) {
    console.error('更新授信使用额度失败:', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: '更新授信使用额度失败',
    }
  }
})

// 获取授信信息接口
router.get('/info', async (ctx) => {
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

    ctx.body = {
      success: true,
      data: {
        creditInfo,
        remainingAuthorize: creditInfo.creditLimit - creditInfo.creditUsed,
        isValid: isAuthorizeValid(creditInfo),
      },
      message: '获取授信信息成功',
    }
  } catch (error) {
    console.error('获取授信信息失败:', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: '获取授信信息失败',
    }
  }
})

export default router
