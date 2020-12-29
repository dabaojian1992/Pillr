const express = require("express");
const app = express();

const db = require('./config/keys').mongoURI;
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');


const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',  //added this due to CORS error
  }
});

const connect = mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

const users = require("./routes/api/users");
const messages = require("./routes/api/messages");
const rooms = require("./routes/api/rooms");
const bodyParser = require('body-parser');
const giphy = require("./routes/api/giphy")

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/users", users);
app.use("/api/messages", messages);
app.use("/api/rooms", rooms);
app.use("/api/giphy", giphy);
const Message = require("./models/Message");
const Room = require("./models/Room");
//const room = require("./validation/room");


io.on("connection", socket => {
  console.log(`connection made from socket id ${socket.id}`);

  socket.on("leave room", package => {
    // 
    io.emit("user left", package);
  });

  socket.on("join room", package => {
    io.emit("user joined", package);
  });


  socket.on("Create Message", msg => {
    connect.then(db => {
      try {

        const message = new Message({
          message: msg.message,
          sender: msg.userId,
          room: msg.room,
          username: msg.username,
        });

        message.save((err, document) => {
          //record error, if any
          if (err) return res.json({ success: false, err });
          
          //add to a rooms array of messages
          Room.findOneAndUpdate(
            { _id: document.room._id },
            { $push: { messages: document } },
            (error, success) => {
               
              if (error) {
                console.log("Add message to room array failed: " + error);
              } else {
                io.emit(`MTC_${document.room._id.toString()}`, document);
                console.log("Username: "+message.username);
              }
            }
          )
            
        })
      } catch (error) {
        console.log(error);
      }
    })

  })

  //EDIT MESSAGE
  socket.on("Edit Message", msg => {
    connect.then(db => {
      try {

        const message = Message.findById(msg.id, (err, message)=>{
          message.message = msg.message;

          message.save((err, document) => {
            //record error, if any
            
            if (err) return res.json({ success: false, err });
            io.emit("Message Edited", document);
          })
        });
      } catch (error) {
        console.log(error);
      }
    })

  })


  //DELETE MESSAGE
  socket.on("Delete Message", msg => {
    connect.then(db => {
      try {
         
        const message = Message.findByIdAndDelete(msg.id, (err, message)=>{
           
          if (err) return res.json({ success: false, err });
          io.emit("Message Deleted", message);
          });
      } catch (error) {
        console.log(error);
      }
    })

  })



})

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
