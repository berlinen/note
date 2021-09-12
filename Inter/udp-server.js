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