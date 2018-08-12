const express = require('express')
const path = require('path')
const net = require('net')

const fileRouter = require('./server/routers/file')

const app = express()
app.use(express.static(path.resolve(__dirname, 'software')))
app.use(express.static(path.resolve(__dirname, 'dist')))
app.use('/file', fileRouter)

app.get('/', () => {
    return 
})

let port = 4500

function isInUse(tmp, callback) {
    let server = net.createServer().listen(tmp)
    server.on('error', err => {
        console.log(err.code)
        if (err.code === 'EADDRINUSE') {
            tmp = tmp + 1
            isInUse(tmp, callback)
        }
    })
    server.on('listening', () => {
        server.close()
        callback(tmp)
    })
}

isInUse(port, final => {
    console.log('port is ', final)
    app.listen(final, '0.0.0.0', () => {
        console.log(`server is listening at port ${final}`)
    })
})





