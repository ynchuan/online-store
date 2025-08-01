import jwt from 'jsonwebtoken'

// JWT密钥，在生产环境中应该从环境变量获取
const JWT_SECRET: any = process.env.JWT_SECRET || 'ynchuan123'
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || '24h'

// 授信信息接口
export interface AuthorizeInfo {
  userId: string // 用户唯一标识
  creditLimit: number // 授信额度上限
  creditUsed: number // 已使用的授信额度
  creditStatus: 'active' | 'suspended' | 'expired' // 授信状态：active(正常)、suspended(暂停)、expired(过期)
  expiresAt: Date // 授信过期时间
}

// 生成授信token
export const authorizeTokenGenerate = (creditInfo: AuthorizeInfo): string => {
  const payload = {
    ...creditInfo,
    expiresAt: creditInfo.expiresAt.toISOString(),
    iat: Math.floor(Date.now() / 1000),
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// 验证授信token
export const authorizeTokenVerify = (token: string): AuthorizeInfo | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      userId: decoded.userId,
      creditLimit: decoded.creditLimit,
      creditUsed: decoded.creditUsed,
      creditStatus: decoded.creditStatus,
      expiresAt: new Date(decoded.expiresAt),
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// 检查授信是否有效
export const authorizeIsValid = (creditInfo: AuthorizeInfo): boolean => {
  const now = new Date()
  if (creditInfo.creditStatus !== 'active') return false
  if (creditInfo.expiresAt < now) return false
  if (creditInfo.creditUsed >= creditInfo.creditLimit) return false
  return true
}

// 从请求头中提取token
export const tokenExtractFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.substring(7)
}
