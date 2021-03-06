const express = require("express");
const connectDB = require("./config/db");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const idToName = require("./utils/idToName");

const path = require("path");

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/user", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

var myMap = new Map();

io.on("connection", function(socket) {
  socket.on("disconnected", () => {
    socket.disconnect(true);
  });

  socket.on("active", data => {
    socket.join(data.room);

    var users = [];

    idToName(data.token, name => {
      socket.nickname = name;

      io.clients((error, clients) => {
        if (error) throw error;
        clients.map(client => {
          if (
            io.sockets.sockets[client].nickname !== undefined &&
            io.sockets.sockets[client].nickname !== "user"
          ) {
            users.push({
              name: io.sockets.sockets[client].nickname,
              id: io.sockets.sockets[client].id
            });
          }
        });
        io.to(data.room).emit("active", users);
      });
    });
  });

  socket.on("msg-room", data => {
    idToName(data.token, name => {
      io.in(data.room).emit("msg-room", { name: name, body: data.text });
    });
  });

  socket.on("login-room", data => {
    socket.join(data);
  });

  socket.on("get-time", data => {
    if (myMap.get(data.room) < Date.now()) {
      myMap.set(data.room, Date.now() + 30000);
    } else if (myMap.get(data.room) == undefined) {
      myMap.set(data.room, Date.now() + 30000);
    }
    io.to(data.room).emit("get-time", { getTime: myMap.get(data.room) });
  });

  //revisar
  socket.on("exit", data => {
    socket.leave(data.room);

    var users = [];
    idToName(data.token, name => {
      socket.nickname = name;

      io.clients((error, clients) => {
        if (error) throw error;
        clients.map(client => {
          if (
            io.sockets.sockets[client].nickname !== undefined &&
            io.sockets.sockets[client].nickname !== "user"
          ) {
            users.push({
              name: io.sockets.sockets[client].nickname,
              id: io.sockets.sockets[client].id
            });
          }
        });

        io.to(data.room).emit("active", users);
      });
    });
  });
});
