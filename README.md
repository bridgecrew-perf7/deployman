# deployman

一个 k8s 部署钩子🪝，接收到 Action 构建完成的事件，触发飞书机器人通知发布者。

## 介绍

服务构成分两块，一块是外部可访问的钩子，一块是内部访问的部署服务

### webhook

\# 外部可访问

```http
POST /webhook/<service-name>
Host: localhost:8080
content-type: application/json
x-github-token: <service-token>

{
  "version": "v1.0.0",  // 构建的镜像版本号
  "comment-id": "xxxxx" // 提交ID
}
```

-> POST 请求到部署服务

### rpc

\# 内部访问

```http
POST /rpc
Host: localhost:3456
content-type: application/json
x-github-token: <service-token>

{
  "id": "xxxxx",  // 随机值
  "method": "tag",  // 远程调用的方法名
  "params": ["recommend", "paiya", "v1.0.0"]
}
```

## 环境变量

```bash
PORT=8080
HTTP_ENABLE=true
RPC_URL=http://localhost:3456/rpc
```
