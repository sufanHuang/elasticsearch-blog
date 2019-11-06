const express = require("express")
const to = require('await-to-js').default
const _ = require("lodash")
const { Client } = require("@elastic/elasticsearch")
const client = new Client({node: 'http://localhost:9200'})
const app = express()
app.use(express.json())

const index = 'posts'


app.get('/api/posts', async(req,res)=>{
    let parameters = {
        index,
        size: 1000
    }
    let [ error, result] = await to(client.search(parameters))
    let items = _.get(result, 'body.hits.hits')
    let outputData = _.map(items, (currentItem) => {
        return _.assign({ id: currentItem._id}, currentItem._source)
    })

    if(error){
        res.send(error)
    }
    res.json(outputData)
})

app.get('/api/posts/:id', async(req,res)=>{
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
    let item =_.get(result,"body.hits.hits[0]")
    let outputItem = _.assign( { id: item._id}, item._source)
    if(outputItem){
       res.json(outputItem)
    } else {
        console.log("item not found")
    }


})

app.post('/api/posts', async (req, res)=>{
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

app.delete('/api/posts/:id', async(req,res)=>{
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

app.put('/api/posts/:id', async(req, res)=>{
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
    console.log('server is running at 4000')
})
