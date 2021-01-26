const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoDb = require("./config/db");
const colors = require("colors");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");

const product = require("./routes/product");
const user = require("./routes/users");
const chat = require("./routes/chat");
const order = require("./routes/orders");
const uploads = require("./routes/uploads");
const { Chat } = require("./models/Chat");

const { errorHandler, notFound } = require("./midleware/errorMidleware");
const transporter = require("./config/config");

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const connect = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected...".brightBlue))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/products", product);
app.use("/api/users", user);
app.use("/api/chat", chat);
app.use("/api/orders", order);
app.use("/api/upload", uploads);

/* ----------Contact send email----------- */

nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/api/contact", (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;
  var content = `
  <p>You have a new contact request.</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${name}</li>
    <li>Email: ${email}</li>
    <li>Subject: ${subject}</li>
    <li>Message: ${message}</li>
  </ul>
  `;
  var mail = {
    from: name,
    to: process.env.EMAIL,
    subject: subject,
    html: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({ status: "fail" });
    } else {
      res.json({ status: "success" });
    }
  });
});

/* ------------------Email send end--------------------- */

app.get("/api/config/paypal", (req, res) => {
  return res.send(process.env.PAYPAL_CLIENT_ID);
});

//const __dirname = path.resolve()
//app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: [
      {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Credentials": true,
      },
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("We have a connection");
  socket.on("Input Chat Message", (msg) => {
    connect.then((db) => {
      try {
        let chat = new Chat({
          message: msg.chatMessage,
          sender: msg.userId,
          type: msg.type,
        });

        chat.save((err, doc) => {
          console.log(doc);
          if (err) return res.json({ success: false, err });

          Chat.find({ _id: doc._id })
            .populate("sender")
            .exec((err, doc) => {
              return io.emit("Output Chat Message", doc);
            });
        });
      } catch (error) {
        console.error(error);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User left");
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // fileFilter: (req, file, cb) => {
  //   const ext = path.extname(file.originalname)
  //   if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
  //     return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
  //   }
  //   cb(null, true)
  // }
});

var upload = multer({ storage: storage }).single("file");

app.post("/api/chat/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, url: res.req.file.path });
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(
    `Server runing in ${process.env.NODE_ENV} mode on port: ${PORT}`.brightBlue
  )
);
