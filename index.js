const express = require('express')
const SmartDownloader = require('smart-downloader');
const web3client = require('web3.storage')
const dotenv = require('dotenv')
const fs = require('fs')

const downloader = new SmartDownloader();

dotenv.config()

const app = express()
app.use(
    express.urlencoded({
      extended: true
    })
  )
  
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/download', async (req, res) => {
    const {url, name} = req.body
    fs.mkdir(__dirname+"/downloads/"+name, err => {
        if (err) {
            console.error(err)
        }
        console.log("Made directory")
    })
    console.log("Downloading"+url) 
    await downloader.download({
        uri: url,
        destinationDir: __dirname + '/downloads/'+name+"/"
    }, async (err, data)=>{
        if (err) {
            console.log(err)
        }
        console.log(data)
        const cidr =  await uploadFiles(name)
        res.send(cidr)
    })
})

async function uploadFiles(name) {
    const client = new web3client.Web3Storage({token: process.env.TOKEN})

    const files = await getFiles(name)
    console.log(files)

    const cid = await client.put(files, {
        wrapWithDirectory: false,
        name: name
    })
    console.log('uploaded')
    
    return cid
    
}

async function getFiles(name) {
    const files = await web3client.getFilesFromPath(`downloads/${name}`)
    console.log(`reading ${files.length}`)
    return files
}

app.listen(process.env.PORT || 8080)