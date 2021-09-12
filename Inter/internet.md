# 网络

## TCP/IP网络协议

聊TCP/IP协议之前, 咱们先看一下OSI七层模型.

第 7 层：应用层 为操作系统或网络应用程序提供访问网络服务的接口。应用层协议的代表包括： HTTP，HTTPS，FTP，SSH
第 6 层：表示层 数据加密，压缩，格式转换等
第 5 层：会话层 负责数据传输中设置和维持网络设备之间的通信连接
第 4 层：传输层 把传输表头加至数据形成数据包，完成端到端的数据传输。 比如: TCP，UDP 等
第 3 层：网络层 负责对子网间的数据包进行寻址和路由选择，还可以实现拥塞控制，网际互联等功能。网络层的协议包括：IP，IPX 等
第 2 层：数据链路层
第 1 层：物理层

1. html在哪一层？ 路由器在哪一层? 视频面试底层采用的是什么协议？ TCP？ UDP？

2. 那么咱们一直提到的协议是啥意思? 协议是什么?

通俗点说：是协议定义了每一层的作用是什么, 每一层的职责是什么, 类似于规范和约束.

3. TCP/IP协议具体指什么？

有的文章里就是具体指的TCP协议和IP协议, 但是大多数时候提到的TCP/IP协议, 可以理解为互联网通信所需要的协议, 是一个协议家族, 以TCP、IP协议为核心, 包含HTTP、SMTP、TELNET等各种协议。

4. TCP/IP参考模型?

TCP/IP参考模型是一个抽象的分层模型，这个模型中，所有的TCP/IP系列网络协议都归类到4个抽象的“层”中.

可以看一下图 **assets/OSI和TCPIP概念模型.png**

5. 我们常说的数据包是什么?

数据包是网络层及以上分层中包的单位.

每个分层都会对发送的数据添加一个首部, 首部包含了该层协议相关的信息, 而真正要发送的内容称之为数据. (首部 + 数据)  = 数据包 可以理解为叠加的过程

也就是说每一个数据包都由首部 + 数据组成.

而对于下层来说, 上层发送过来的全部内容, 都会当做本层的数据, 举个例子：

传输层 TCP包：TCP包首部 + 数据
网络层 IP包：IP包首部 + (TCP包首部 + 数据)
数据链路层 以太网包：以太网包首部 + (IP包首部 + (TCP包首部 + 数据))

这里可以看图 **assets/TCP_IP_数据包.png**

6. 每层在接收到数据后除了添加首部, 还要做什么呢?

用户1
* 传输层：TCP模块为保证数据的可靠传输, 需要添加TCP首部
* 网络层：IP包生成后，参考路由控制表决定接受此 IP 包的路由或主机。
* 数据链路层：生成的以太网数据包将通过物理层传输给接收端

中间通过物理层连接

用户2
* 数据链路层：主机收到以太网包后，首先从以太网包首部找到 MAC 地址（即物理地址）（网络地址决定ip，物理地址决定设备）判断是否为发送给自己的包，若不是则丢弃数据。
* 网络层：从包首部中判断此 IP 地址是否与自己的 IP 地址匹配
* 传输层：最后检查端口号，确定具体的应用程序。数据被完整地接收以后，会传给由端口号识别的应用程序。


总结一下几个地址：

* 数据链路层的是MAC地址, 用来识别同一链路中的不同计算机
* 网络层的是IP地址, 用来识别TCP/IP 网络中互连的主机和路由器
* 传输层的是端口号(程序地址), 用来识别同一台计算机中进行通信的不同应用程序

7. 那么我们通过这三个地址就可以识别一次通信了吗?

我们需要通过以下这几个数据综合来识别一次通信：

* IP首部：源IP地址
* IP首部：目标IP地址
* 协议号, TCP或者UDP
* TCP首部：源端口号
* TCP首部：目标端口号

8. 我们常说的TCP/UDP他们的区别是什么？分别适合用在什么场景?

* UDP是无连接的，TCP必须三次握手建立连接
* UDP是面向报文，没有拥塞控制，所以速度快，适合多媒体通信要求，比如及时聊天，支持一对一，一队多。多对一，多对多。
* TCP只能是一对一的可靠性传输

那么咱们的直播底层是什么协议呢?

其实现在常见的rtmp和hls直播, 都是基于TCP的, 希望能提供稳定的直播环境. 可能也有私有定制的udp

9. TCP通过什么方式提供可靠性？

* 超时重发，发出报文段要是没有收到及时的确认，会重发。
* 数据包的校验，也就是校验首部数据和。
* 对失序的数据重新排序
* 进行流量控制，防止缓冲区溢出
* 快重传和快恢复
* TCP会将数据截断为合理的长度

10. TCP如何控制拥塞？

* 控制拥塞为了什么？是为了防止过多的数据注入到网路中，这样可以使网络中的路由器或链路不会导致致过载。

* 两个概念：

1) 发送方需要维持一个拥塞窗口，是一个状态变量 cwnd

2) ssthresh 慢开始门限 可以理解为一个常量

* 算法

cwnd < ssthresh 使用慢开始算法， 也就是 乘法运算 2 4 6 8

当cwnd > ssthresh时，改用拥塞避免算法。也就是加法算法

当cwnd =  ssthresh时，慢开始与拥塞避免算法任意。

当出现拥塞的时候就把新的门限值设为此时窗口大小的一半，窗口大小设置为1，再重新执行上面的步骤。

```js
 ssthres = cwnd/2
 cwnd = 1
```

11.  TCP协议的一次数据传输, 从建立连接到断开连接都有哪些流程?

可以看一下图 **assets/TCP数据传输流程.jpeg**

疯狂确认的过程～～～～～～～～～～～

第一次握手：建立连接。客户端发送连接请求报文段，将SYN位置为1，Sequence Number为x；然后，客户端进入SYN_SEND状态，等待服务器的确认；

第二次握手：服务器收到客户端的SYN报文段，需要对这个SYN报文段进行确认，设置Acknowledgment Number为x+1(Sequence Number+1)；同时，自己自己还要发送SYN请求信息，将SYN位置为1，Sequence Number为y；服务器端将上述所有信息放到一个报文段（即SYN+ACK报文段）中，一并发送给客户端，此时服务器进入SYN_RECV状态；

第三次握手：客户端收到服务器的SYN+ACK报文段。然后将Acknowledgment Number设置为y+1，向服务器发送ACK报文段，这个报文段发送完毕以后，客户端和服务器端都进入ESTABLISHED状态，完成TCP三次握手。

完成了三次握手，客户端和服务器端就可以开始传送数据。以上就是TCP三次握手的总体介绍。通信结束客户端和服务端就断开连接，需要经过四次分手确认。

第一次分手：主机1（可以使客户端，也可以是服务器端），设置Sequence Number和Acknowledgment Number，向主机2发送一个FIN报文段；此时，主机1进入FIN_WAIT_1状态；这表示主机1没有数据要发送给主机2了；

第二次分手：主机2收到了主机1发送的FIN报文段，向主机1回一个ACK报文段，Acknowledgment Number为Sequence Number加1；主机1进入FIN_WAIT_2状态；主机2告诉主机1，我“同意”你的关闭请求；

第三次分手：主机2向主机1发送FIN报文段，请求关闭连接，同时主机2进入LAST_ACK状态；

第四次分手：主机1收到主机2发送的FIN报文段，向主机2发送ACK报文段，然后主机1进入TIME_WAIT状态；主机2收到主机1的ACK报文段以后，就关闭连接；此时，主机1等待2MSL后依然没有收到回复，则证明Server端已正常关闭，那好，主机1也可以关闭连接了。

1.  IP地址

IP 地址（IPv4 地址）由x位正整数来表示 二进制

IP地址包含网络标识和主机标识, 比如172.112.110.11

172.112.110就是网络标识, 同一网段内网络标识必须相同

11就是主机标识, 同一网段内主机标识不能重复

12. IPv6

IPv6（IP version 6）是为了根本解决 IPv4 地址耗尽的问题而被标准化的网际协议。IPv4 的地址长度为 4 个 8 位字节，即 32 比特。而 IPv6 的地址长度则是原来的 4 倍，即 128 比特，一般写成 8 个 16 位字节。

13. DNS

我们平时访问一个网站, 一个应用程序, 并不是用ip来访问的, 而是用一个域名. 那么域名是怎么和ip地址建立联系的呢?

就是通过dns, Domain Name System.

以访问 zh.terminus.io 为例：

客户端 "query zh.terminus.io"至DNS服务器，(DNS服务器首先检查自身缓存，如果存在记录则直接返回结果)

如果记录老化或不存在，则：

DNS服务器向根域名服务器发送查询报文"query zh.terminus.io"，根域名服务器返回顶级域 .io 的顶级域名服务器地址

DNS服务器向 .io 域的顶级域名服务器发送查询报文"query zh.terminus.io"，得到二级域 .terminus.org 的权威域名服务器地址

DNS服务器向 .terminus.io 域的权威域名服务器发送查询报文"query zh.terminus.io"，得到主机 zh 的A记录，存入自身缓存并返回给客户端


### 如何使用Nodejs来创建一个TCP服务?

在这之前咱们要先来了解一下Socket的概念, 比如常用的 (webpack-dev-server)

我们经常把socket翻译为套接字，socket是在应用层和传输层之间的一个抽象层，它把TCP/IP层复杂的操作抽象为几个简单的接口供应用层调用已实现进程在网络中通信, 比如create，listen，accept，connect，read和write等等。

* http 应用层模块，主要按照特定协议编码数据

* net 传输层模块， 主要负责传输编码后的应用层数据

* https:包含http crypto 主要是为了确保数据安全性


1. 创建tcp服务端

```js
const net = require('net'); // 传输层

const HOST = '127.0.0.1';
const PORT = 7777;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// net.createServer()有一个参数, 是监听连接建立的回调
net.createServer((socket) => {
    const remoteName = `${socket.remoteAddress}:${socket.remotePort}`;
    // 建立成功了一个连接, 这个回调函数里返回一个socket对象.
    console.log(`${remoteName} 连接到本服务器`);

    // 接收消息
    socket.on('data', (data) => {
        console.log(`${remoteName} - ${data}`)
        // 给客户端发消息
        socket.write(`你刚才说啥？是${data}吗？`);
    });

    // 关闭
    socket.on('close', (data) => {
        console.log(`${remoteName} 连接关闭`)
    });

}).listen(PORT, HOST);

console.log(`Server listening on ${HOST}:${PORT}`);
```

2. 创建tcp客户端

```js
const net = require('net'); // 传输层

const HOST = '127.0.0.1';
const PORT = 7777;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// net.createServer()有一个参数, 是监听连接建立的回调
net.createServer((socket) => {
    // 拿远程ip和端口号
    const remoteName = `${socket.remoteAddress}:${socket.remotePort}`;
    // 建立成功了一个连接, 这个回调函数里返回一个socket对象.
    console.log(`${remoteName} 连接到本服务器`);
    // 可以当做事件机制看
    // 接收消息
    socket.on('data', (data) => {
        console.log(`${remoteName} - ${data}`)
        // 给客户端发消息
        socket.write(`你刚才说啥？是${data}吗？`);
    });

    // 关闭
    socket.on('close', (data) => {
        console.log(`${remoteName} 连接关闭`)
    });

}).listen(PORT, HOST);

console.log(`Server listening on ${HOST}:${PORT}`);

```

3. 运行一下

`node tcp-server.js`

`node tcp-client.js`

### 如何使用NodeJs来创建一个UDP服务?

1. 创建udp服务端

```js
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, remote) => {
    console.log(`${remote.address}:${remote.port} - ${msg}`)
    // 一对一 一对多 多对一 多对多
    server.send(`收到！`, remote.port, remote.address);
})
// 监听
server.on('listening', () => {
    // 去拿服务被分配的地址
    const address = server.address()
    console.log(`Server listening on ${address.address}:${address.port}`);
})

// 去绑定一个端口
server.bind(44444); // 0.0.0.0:44444 面向公网的ip
```

2. 创建udp客户端

```js
const dgram = require('dgram')
const message = Buffer.alloc(6, 'berlin')
const client = dgram.createSocket('udp4')
/**
 * messing string Buffer
 * 0 偏移量
 * message.length 确定能发送几个字节
 * 端口
 */
client.send(message, 0, 2, 44444, 'localhost',
    (err, bytes) => {
        console.log(`发送成功${bytes}字节`);
        // client.close()
    }
)

client.on('message', (buffer) => {
    console.log(buffer.toString())
})
```

3. 运行一下

`node udp-server.js`

`node udp-client.js`


## HTTP

下次分享

## 附加

## js 模块化



#### 彩蛋

```js
Promise.resolve().then(() => {
  console.log(0)
  return Promise.resolve(4)
}).then(res => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(1)
}).then(() => {
  console.log(2)
}).then(() => {
  console.log(3)
}).then(() => {
  console.log(5)
}).then(() => {
  console.log(6)
}).then(() => {
  console.log(7)
}).then(() => {
  console.log(8)
})

```

1. 发现各大论坛上js模拟的Promise和原生V8引擎的Promise都不一致,是不是有不可替代的区别

2. 看了网上有人说原生Promisie return promise.resolve(4), 会产生两个微任务（自己处理的话，一般都是判断是否是Promise， 如果是会包一层then，也就是多了一层微任务）

3. 为什么会产生两个微任务

- promise A+ 在什么时会return Promise.resolve？ 等到当前执行栈为空的的时候， 才会去resolve掉这个新的Promise

