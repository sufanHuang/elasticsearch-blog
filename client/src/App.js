import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./components/Home"
import Post from "./components/Post"
import Edit from "./components/Edit"
import './App.css';

class App extends Component {
  render(){
      return(
          <div>
              <Router>
                  <Switch>
                      <Route exact path="/" component ={Home} />
                      <Route exact path="/posts" component ={Home} />
                      <Route exact path='/posts/:id' component ={Post}/>
                      <Route exact path='/posts/:id/edit' component ={Edit}/>
                  </Switch>
              </Router>
          </div>
          )
  }
}

export default App;
