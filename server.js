const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure folders exist
["uploads", "output"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const upload = multer({ dest: "uploads/" });

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ================= IMAGE TOOLS =================

// IMAGE COMPRESS
app.post("/api/image-compress", upload.single("image"), async (req, res) => {
  try {
    const out = `img-compress-${Date.now()}.jpg`;
    await sharp(req.file.path)
      .jpeg({ quality: 60 })
      .toFile(`output/${out}`);

    fs.unlinkSync(req.file.path);
    res.json({ success: true, downloadUrl: `/download/${out}` });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// IMAGE RESIZE
app.post("/api/image-resize", upload.single("image"), async (req, res) => {
  try {
    const width = parseInt(req.body.width);
    const out = `img-resize-${Date.now()}.jpg`;

    await sharp(req.file.path)
      .resize({ width })
      .jpeg({ quality: 80 })
      .toFile(`output/${out}`);

    fs.unlinkSync(req.file.path);
    res.json({ success: true, downloadUrl: `/download/${out}` });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// JPG ↔ PNG
app.post("/api/jpg-png", upload.single("image"), async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    let out;

    if (ext === ".png") {
      out = `png-to-jpg-${Date.now()}.jpg`;
      await sharp(req.file.path).jpeg({ quality: 90 }).toFile(`output/${out}`);
    } else {
      out = `jpg-to-png-${Date.now()}.png`;
      await sharp(req.file.path).png().toFile(`output/${out}`);
    }

    fs.unlinkSync(req.file.path);
    res.json({ success: true, downloadUrl: `/download/${out}` });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// DOWNLOAD
app.get("/download/:file", (req, res) => {
  res.download(path.join(__dirname, "output", req.params.file));
});

app.listen(PORT, () => {
  console.log(`EasyPDF Pro running on port ${PORT}`);
});
