const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.post('/upload', (req, res) => {
    
    let chunk = null


    req.on('data', function(data) {
        chunk += data
    })

    req.on('end', function() {
        fs.writeFile( path.resolve(__dirname, 'test'), chunk, function () {
            console.log(arguments)
        })

        res.end('finish')
    })
})

module.exports = router