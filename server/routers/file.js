const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.post('/upload', (req, res) => {
    
    let chunk = Buffer.from([])
    req.on('data', function(data) {
        chunk = Buffer.concat([chunk, data])
    })

    req.on('end', function() {
        let contentType = req.headers['content-type']
        let boundary = contentType.split('=')[1]
        let string = chunk.toString('utf8')
        let fileName = string.slice(8 + boundary.length, string.indexOf('\r\n\r\n')).replace(/"/g, '').split('\r\n')[0].split(';').map(e => e.trim())[2].split('=')[1]
        let rems = []

        //根据\r\n分离数据和报头
        for(let i=0; i < chunk.length; i++){
            let v = chunk[i]
            let v2 = chunk[i + 1]
            if(v === 13 && v2 === 10){
                rems.push(i)
            }
        }
        let fileData = chunk.slice(rems[3] + 2, rems[rems.length - 2])
        fs.writeFile( path.resolve(__dirname, '../../resource',fileName), fileData, function () {

            res.end('finish')
        }) 
    })
})

module.exports = router