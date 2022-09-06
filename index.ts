const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");

app.use(cors(), helmet());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    socket.join(data);
    socket.emit("return_entrydata", {
      id: socket.id,
      year: year,
      month: month,
      date: date,
    });
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
    console.log("User", socket.id, "leave room", data);
  });
  socket.on("send_message", (data) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    const str_minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = date_ob.getSeconds();
    // console.log(data.message);
    socket.to(data.room).emit("receive_message", {
      data: data,
      time: hours + ":" + str_minutes,
      user: socket.id,
      date: { year, month, date },
    });
    socket.emit("receive_message", {
      data: data,
      time: hours + ":" + str_minutes,
      user: socket.id,
      date: { year, month, date },
    });
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
