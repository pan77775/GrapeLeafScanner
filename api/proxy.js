// api/proxy.js

const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer();
app.use(cors());

app.post("/detect", upload.single("file"), async (req, res) => {
  try {
    const response = await fetch("http://220.128.130.212:9000/detect/", {
      method: "POST",
      body: req.file.buffer,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    const resultBuffer = await response.buffer();
    res.set("Content-Type", response.headers.get("content-type"));
    res.send(resultBuffer);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed.");
  }
});

module.exports = app;
