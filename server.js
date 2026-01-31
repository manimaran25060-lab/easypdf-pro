const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

/* =============================
   PORT (RENDER SAFE)
============================= */
const PORT = process.env.PORT || 3000;

/* =============================
   MIDDLEWARE
============================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =============================
   STATIC FILES
============================= */
app.use(express.static(path.join(__dirname, "public")));

/* =============================
   SEO + GOOGLE CRAWL FIX
============================= */

// robots.txt – explicitly allow Google
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /");
});

// sitemap.xml – serve correctly
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sitemap.xml"));
});

/* =============================
   ROUTES – PAGES
============================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/image-compressor", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "compress.html"));
});

app.get("/image-resizer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resize.html"));
});

app.get("/jpg-to-png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "jpg-png.html"));
});

app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "privacy.html"));
});

/* =============================
   404 HANDLER
============================= */
app.use((req, res) => {
  res.status(404).send("404 – Page Not Found");
});

/* =============================
   START SERVER
============================= */
app.listen(PORT, () => {
  console.log(`EasyPDF Pro running on port ${PORT}`);
});
