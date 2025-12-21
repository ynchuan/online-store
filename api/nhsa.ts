import { createProxyMiddleware } from 'http-proxy-middleware'

// http://localhost:3000/nhsa/api/drug/getsearchcondition
// https://wx.nhsa.gov.cn/#/pages/NRDL/index/index

export default (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  )

  // 如果是OPTIONS请求，直接返回200
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const target = 'https://wx.nhsa.gov.cn' // 你的后端API地址
  createProxyMiddleware({
    target: target,
    changeOrigin: true,
    pathRewrite: {
      '^/nhsa': '/nhsa', // 重写路径
    },
  })(req, res)
}
