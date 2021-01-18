const express = require("express");
const router = express.Router();
const { Chat } = require("../models/Chat");

const AsyncHandler = require("express-async-handler");
const { protect, admin } = require("../midleware/authMidleware");

router.get(
  "/getChats",
  AsyncHandler(async (req, res) => {
    await Chat.find()
      .populate("sender")
      .exec((err, chats) => {
        console.log(chats);
        if (err) return res.status(400).send(err);
        res.status(200).send(chats);
      });
  })
);

module.exports = router;
