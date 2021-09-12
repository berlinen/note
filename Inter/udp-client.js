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