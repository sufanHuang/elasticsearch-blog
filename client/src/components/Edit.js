import React, {Component} from "react";
import axios from "axios";
import to from "await-to-js"



export default class Post extends Component {
    state = {
        post: {
            "id": "",
            "title": "",
            "author": "",
            "imageURL": "",
            "content": "",
            "createdAt": ""
        }
    }
    componentDidMount = async () => {
        const {id} = this.props.match.params
        console.log(id)
        let [error, result] = await to(axios.get(`/api/posts/${id}`))
        let post = result.data
        if (error) {
            console.log(error)
        }
        return this.setState({post})
    }

    onTitleChange =(event)=> {this.setState({post:{...this.state.post,"title":event.target.value}})}
    onContentChange =(event)=> {this.setState({post:{...this.state.post,"content":event.target.value}})}
    onImageChange =(event)=> {this.setState({post:{...this.state.post,"imageURL":event.target.value}})}




    onSubmit = async(event)=>{
        event.preventDefault()
        const {title, imageURL,content} = this.state.post
        const updateParameters ={
            title,
            imageURL,
            content
        }
        const {id} = this.props.match.params
        let [ error, result ] = await to(axios.put(`/api/posts/${id}`, updateParameters))
        console.log(result)

        if(error){
            console.log("edit has an error:", error)
        }
        return  this.setState({ title, content })
    }

    changePage =(event)=>{
        event.preventDefault()
        const {id} = this.props.match.params
        this.props.history.push(`/posts/${id}`)
    }


    render(){
        let { title, author, imageURL,content } = this.state.post
        return(
            <div className='App'>
                <div className = "container">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title heading">
                                EDIT POST
                            </h3>
                        </div>

                <form >
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input type="text" className="form-control" name="title" value={title} onChange={this.onTitleChange}
                               placeholder="Title"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content:</label>
                        <textarea className="form-control" name="content" value={content} onChange={this.onContentChange}
                                  placeholder="Content" cols="80" rows="3"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageURL">ImageURL:</label>
                        <input type="url" className="form-control" name="imageURL" value={imageURL} onChange={this.onImageChange}
                               placeholder="Title"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Author:{author}</label>
                    </div>

                    <button type="submit" className="btn btn-dark post-buttons" onClick={this.onSubmit}>Save Change</button>
                    <button type="submit" className="btn btn-info post-buttons" onClick={this.changePage}>Back to Post</button>
                </form>

                 </div>
            </div>
        </div>
        )
    }

}
