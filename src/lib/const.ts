import os from 'os'
import path from 'path'

export const CLIENT_ID = 'f84eef25feed43f18785014633a0380e'
export const CLIENT_SECRET = 'eb08e66896b4296105029d4d21c973734ee93738'
export const LOGIN_PORT = 3009
export const LOGIN_REDIRECT_URI = `http://localhost:${LOGIN_PORT}/callback`
export const LOGIN_URL = `https://jinbao.pinduoduo.com/open.html?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(LOGIN_REDIRECT_URI)}&state=001`
export const PDD_BASE_URL = `https://gw-api.pinduoduo.com/api/router`
export const RC_PATH = path.join(os.homedir(), '.osrc')


export const WX_CLIENT_ID = 'wx388886f3ce894060'
export const WX_CLIENT_SECRET = '411bc1e93fd2c2dc71cf3211d47cbe33'
export const WX_LOGIN_URL = `https://open.weixin.qq.com/connect/qrconnect?appid=${WX_CLIENT_ID}&redirect_uri=${encodeURIComponent(LOGIN_REDIRECT_URI)}&response_type=code&scope=snsapi_login&state=001#wechat_redirect`
export const WX_LOGIN_GET_TOKEN = `https://api.weixin.qq.com/sns/oauth2/access_token`
export const WX_LOGIN_GET_INFO = `https://api.weixin.qq.com/sns/userinfo`
