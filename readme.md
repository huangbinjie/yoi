# yoi

yoi 是一个基于 actor 架构的 node server 框架，兼容 express 独立插件。
仅兼容 express 的独立插件。

## 工作原理

每当有请求进来，server 会生成一条 actor 工作流，按照 app.use 的顺序递归生成子 actor，然后把这条工作流挂在 actor system 底下。 理论上 actor system 需要这个时候就可以为这条 line 分配线程了。但是nodejs 是单线程的，所以 actor system 这里只能分配 listener 了。

这条 line 挂载到 system 之后，server 会生成消息叫`Context`，每条 line 都有一个 context。context 仅仅包含了一些每个 actor 可能需要的对象，比如 request， response。这里为了兼容 express，request 和 response 都是 express 的 request 和 response。

前两步完成之后，从起点(挂载的第一个 actor)开始处理逻辑，然后依次交给子 actor，这就是 middleware。

server 本身保持最小抽象。仅仅是一个 生成 context 的 actor system。

## 其他

主要是学习角度吧，actor 很好玩的。如果以后 nodejs 有了多线程，这套架构绝对会发光的。还有很多 express 的方法没实现，比如，req.hostname, res.send 等等。当然没这么多精力，我只挑我认为比较重要的，然后抄下 express 的源码。实现起来应该没难度:joy:。如果有人帮忙就更好啦。