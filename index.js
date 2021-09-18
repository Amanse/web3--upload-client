const express = require('express')
const download = require('download')
const web3client = require('web3.storage')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/download', async (req, res) => {
    const url = req.query.url
    console.log(url)
    await download(url, 'downloads')
    const cidr =  await uploadFiles()
    
    res.send(cidr)
})

async function uploadFiles() {
    const client = new web3client.Web3Storage({token: process.env.TOKEN})

    const files = await getFiles()
    console.log(files)

    const cid = await client.put(files)
    
    return cid
    
}

async function getFiles() {
    const files = await web3client.getFilesFromPath('downloads')
    console.log(`reading ${files.length}`)
    return files
}

app.listen(8080)