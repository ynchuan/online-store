# 授信API文档

基于JWT实现的授信系统，支持授信token的生成、验证和管理。

## API接口

### 1. 生成授信token

**POST /auth/credit**

请求参数：

```json
{
  "userId": "user123",
  "creditLimit": 10000,
  "creditUsed": 0,
  "creditStatus": "active",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### 2. 检查授信有效性

**GET /auth/credit/verify**

请求头：`Authorization: Bearer <token>`

### 3. 更新授信使用额度

**PUT /auth/credit/usage**

请求头：`Authorization: Bearer <token>`
请求参数：`{"amount": 500}`

### 4. 获取授信信息

**GET /auth/credit/info**

请求头：`Authorization: Bearer <token>`

## 使用示例

```bash
# 生成授信token
curl -X POST http://localhost:3001/auth/credit \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "creditLimit": 10000, "expiresAt": "2024-12-31T23:59:59.000Z"}'

# 验证授信
curl -X GET http://localhost:3001/auth/credit/verify \
  -H "Authorization: Bearer <your-token>"
```
