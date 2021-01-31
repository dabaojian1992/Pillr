import React, { Component } from 'react';
import { debug } from 'request';
import EditMessageForm from './edit_message_form_container.js';
import Replies from './replies.jsx';
import RepliesForm from './replies_container.js'
export default class Message extends Component {

  constructor(props) {
    super(props);
    this.state = {
      repliesOpen: false
    }
    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.deleteGif = this.deleteGif.bind(this);
    this.toggleReplies = this.toggleReplies.bind(this)
  };

  componentDidMount(){
    this.props.socket.on("Message Edited", this.editMessage);
    this.props.socket.on("Message Deleted", this.deleteMessage);
  };

  editMessage(msg){
     
    if (msg._id === this.props.msg.id){
      this.props.editMessage(msg);
    }
  };

  deleteMessage(msg){
    if (msg._id === this.props.msg.id) {
      this.props.deleteMessage(msg);
    }
  };

  deleteGif(){
    let response = window.confirm(`Are you sure you want to delete your Gif?`);
    if (response) {
      this.props.socket.emit("Delete Message", this.props.msg);
    }
  };

  toggleReplies(){
    this.state.repliesOpen === true ? 
    this.setState({repliesOpen: false}) : this.setState({repliesOpen: true})
  };
  
  render() {
    //show edit button only if current user was the author of this message
    //open edit message textfield form if button is clicked
    //use socket to edit database and all connected users' message
    //update redux state (room and messages)
    let msg = this.props.msg;
    let author = false;
  
    if (msg.sender === this.props.user.id){
       author = true;
     }
    
    let message;
    if (msg.message.includes('giphy')){
      message = <li className="message-li" key={msg.id}>
                    <h6>{msg.username}: </h6>
                    <img className="chat-img" src={msg.message} alt="image" />
                  {author && 
                    <button onClick={this.deleteGif}>Delete Gif</button>
                  }
                </li>         
    } else {
      message = 
      
      <li className="message-li" key={msg.id} id={this.props.id}>
        <div className="message-li-text">
          <h6>{msg.username}:</h6>
          <p>{msg.message}</p>
        </div>
        <div className="message-li-buttons">
          {
            author && <EditMessageForm socket={this.props.socket} msg={msg}/> 
          }       
          <RepliesForm socket={this.props.socket} msg={msg} message={msg.message}/>
        </div>
      </li>
    }

   
    return (
      <div className="message-container">
        {message}
      </div>
   
    )
  }
}
