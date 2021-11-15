const express = require('express')
const SmartDownloader = require('smart-downloader');
const web3client = require('web3.storage')
const dotenv = require('dotenv')

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
    const {url} = req.body
    console.log("Downloading"+url) 
    await downloader.download({
        uri: url,
        destinationDir: __dirname + '/downloads/'
    }, async (err, data)=>{
        if (err) {
            console.log(err)
        }
        console.log(data)
        const cidr =  await uploadFiles(data.name)
        res.send(cidr)
    })
})

async function uploadFiles(name) {
    const client = new web3client.Web3Storage({token: process.env.TOKEN})

    const files = await getFiles()
    console.log(files)

    const cid = await client.put(files, {
        wrapWithDirectory: false,
        name: name
    })
    console.log('uploaded')
    
    return cid
    
}

async function getFiles() {
    const files = await web3client.getFilesFromPath('downloads')
    console.log(`reading ${files.length}`)
    return files
}

app.listen(process.env.PORT || 8080)