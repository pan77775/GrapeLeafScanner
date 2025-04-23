const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer();
app.use(cors());

app.post("/detect", upload.single("file"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await fetch("http://220.128.130.212:9000/detect/", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const resultBuffer = await response.buffer();
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Access-Control-Allow-Origin", "*"); // ⭐ 強制加上 CORS 回應 header
    res.send(resultBuffer);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).send("Proxy Error");
  }
});

module.exports = app;
