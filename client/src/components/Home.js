import React, { Component } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import to from "await-to-js"

class App extends Component {
    state = {
        posts:[],
        newPost:{
            id:"",
            title:"",
            author:"",
            imageURL:"",
            content:"",
            createdAt:""
        }
    }

    componentDidMount(){
        this.listAll()
    }


    onTitleChange = event =>{this.setState({newPost:{...this.state.newPost, "title": event.target.value}})}
    onAuthorChange = event =>{this.setState({newPost:{...this.state.newPost, "author": event.target.value}})}
    onContentChange = event =>{this.setState({newPost:{...this.state.newPost, "content": event.target.value}})}
    onImageChange = event =>{this.setState({newPost:{...this.state.newPost, "imageURL": event.target.value}})}


    listAll = async()=>{
        let [ error, result ] = await to (axios.get("/api/posts"))
        console.log(result)
        if(error){
            console.log('ListAll has error')
        }
        return this.setState({posts:result.data})
    }

    addItem = async(event)=> {
        event.preventDefault()
        let { posts, newPost } =this.state
        const dataParameters = {
            "title": newPost.title,
            "author": newPost.author,
            "imageURL": newPost.imageURL,
            "content": newPost.content,
            "createdAt": newPost.createdAt
        }

        let [ error, result ]= await to(axios.post("/api/posts",dataParameters))
        console.log(result.data)
        if(error){
            console.log('addItem has error')
        }

        return this.setState({
            posts: [...posts, result.data],
            newPost:  {"id":"", "title":"", "author":"", "imageURL":"","content":"", "createdAt":""}
        })
    }


    render(){
        const { posts, newPost } = this.state
        return (
            <div className='App'>
            <div className = "container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title heading">
                            Elasticsearch Blog Admin App
                        </h3>
                        <h3 className="panel-title heading">
                            ADD POST
                        </h3>
                    </div>
                    <form >
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input type="text" className="form-control" name="title" value={newPost.title} onChange={this.onTitleChange}
                                   placeholder="Title"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Content:</label>
                            <textarea className="form-control" name="content" value={newPost.content} onChange={this.onContentChange}
                                      placeholder="Content" cols="80" rows="3"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageURL">ImageURL:</label>
                            <input type="url" className="form-control" name="imageURL" value={newPost.imageURL} onChange={this.onImageChange}
                                   placeholder="ImageURL"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="author">Author:</label>
                            <input type="text" className="form-control" name="author" value={newPost.author} onChange={this.onAuthorChange}
                                   placeholder="Author"/>
                        </div>
                        <button type="submit" className="btn btn-secondary post-buttons" onClick={this.addItem}>Submit</button>
                    </form>

                </div>

                <div className= "list-group">
                    <ul className='post-items'>
                        {
                            posts.map(currentPost =>{
                                return (
                                    <div key = {currentPost.id}>
                                        <h5 className='post-item'>
                                          <i class="far fa-folder-open"></i>
                                            <Link to = {{
                                                pathname: `/posts/${currentPost.id}`
                                            }}>  { currentPost.title}</Link>
                                        </h5>

                                    </div>
                                )
                            })
                        }
                    </ul>

                </div>
            </div>
        </div>
        )
    }

}

export default App;
