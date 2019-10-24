const express = require("express")
const cors = require("cors")
const to = require('await-to-js').default
const { Client } = require("@elastic/elasticsearch")
const client = new Client({node: 'http://localhost:9200'})
const app = express()
app.use(cors())
app.use(express.json())

const index = 'posts'

app.get('/', (req,res)=>{
    res.send('go to /posts')
})

app.get('/posts', async(req,res)=>{
    let parameters = {
        index,
        size: 1000
    }
    let [ error, result] = await to(client.search(parameters))
    if(error){
        res.send(error)
    }
    res.send(JSON.stringify(result))
})

app.get('/posts/:id', async(req,res)=>{
    const { id } = req.params
    let parameters ={
        index,
        body:{
            query:{
                match: {_id:id}
            }
        }
    }
    let [ error, result] = await to (client.search(parameters))
    if(error){
        res.send(error)
    }
    res.send(JSON.stringify(result))

})

app.post('/posts', async (req, res)=>{
    const { title, author, imageURL, content} = req.body
    let parameters = {
        index,
        body:{
            title,
            author,
            imageURL,
            content,
            createdAt:Date()
        }
    }
    let [ error ] =await to (client.index(parameters))
    if(error){
        res.send(error)
    }
    res.send('adding a post')
})

app.delete('/posts/:id', async(req,res)=>{
    const { id } = req.params
    let parameters = {
        id,
        index
    }
    let [error] =await to(client.delete(parameters))
    if(error){
        res.send(error)
    }
    res.send("deleting a post")
})

app.put('/posts/:id', async(req, res)=>{
    const { id } = req.params
    const { title,imageURL, content}=req.body
    let parameters = {
        id,
        index,
        body:{
            doc: {
                title,
                imageURL,
                content
            }
        }
    }

    let [ error, result] = await to (client.update(parameters))
    if(error){
        res.send(error)
    }
    res.send(result)
})

app.listen(4000,()=>{
    console.log('server is running')
})
