const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer();

// CORS 設定
app.use(cors());
app.options("*", cors());

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
    const contentType = response.headers.get("content-type") || "image/jpeg";

    res.set({
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*", // ⭐️ CORS header 主動設定
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    res.send(resultBuffer);
  } catch (error) {
    console.error("Proxy Error:", error);

    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    res.status(500).send("Proxy error.");
  }
});

module.exports = app;
