const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const PDFDocument = require("pdfkit");
const { createCanvas } = require("canvas");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
    await sharp(req.file.path).jpeg({ quality: 60 }).toFile(`output/${out}`);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, downloadUrl: `/download/${out}` });
  } catch {
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
  } catch {
    res.json({ success: false });
  }
});

// JPG ↔ PNG
app.post("/api/jpg-png", upload.single("image"), async (req, res) => {
  try {
    const input = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let output;
    let outPath;

    if (ext === ".jpg" || ext === ".jpeg") {
      output = `jpg-to-png-${Date.now()}.png`;
      outPath = path.join(__dirname, "output", output);
      await sharp(input).png().toFile(outPath);
    } else if (ext === ".png") {
      output = `png-to-jpg-${Date.now()}.jpg`;
      outPath = path.join(__dirname, "output", output);
      await sharp(input).jpeg({ quality: 90 }).toFile(outPath);
    } else {
      return res.json({ success: false });
    }

    fs.unlinkSync(input);
    res.json({ success: true, downloadUrl: `/download/${output}` });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// ================= PDF TOOLS =================

// JPG → PDF
app.post("/api/jpg-to-pdf", upload.single("image"), async (req, res) => {
  try {
    const out = `jpg2pdf-${Date.now()}.pdf`;
    const doc = new PDFDocument({ compress: true });
    doc.pipe(fs.createWriteStream(`output/${out}`));
    doc.image(req.file.path, { fit: [500, 700] });
    doc.end();

    doc.on("end", () => {
      fs.unlinkSync(req.file.path);
      res.json({ success: true, downloadUrl: `/download/${out}` });
    });
  } catch {
    res.json({ success: false });
  }
});

// PDF → JPG
app.post("/api/pdf-to-jpg", upload.single("pdf"), async (req, res) => {
  try {
    const pdf = await pdfjsLib.getDocument(req.file.path).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const out = `pdf2jpg-${Date.now()}.jpg`;
    fs.writeFileSync(`output/${out}`, canvas.toBuffer("image/jpeg"));
    fs.unlinkSync(req.file.path);

    res.json({ success: true, downloadUrl: `/download/${out}` });
  } catch {
    res.json({ success: false });
  }
});

// COMPRESS PDF
app.post("/api/compress-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const pdf = await pdfjsLib.getDocument(req.file.path).promise;
    const out = `compressed-${Date.now()}.pdf`;
    const doc = new PDFDocument({ compress: true });
    doc.pipe(fs.createWriteStream(`output/${out}`));

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d");

      await page.render({ canvasContext: ctx, viewport }).promise;
      const img = canvas.toBuffer("image/jpeg", { quality: 0.6 });

      doc.addPage({ size: [viewport.width, viewport.height] });
      doc.image(img, 0, 0);
    }

    doc.end();
    fs.unlinkSync(req.file.path);
    res.json({ success: true, downloadUrl: `/download/${out}` });
  } catch {
    res.json({ success: false });
  }
});

// DOWNLOAD
app.get("/download/:file", (req, res) => {
  res.download(path.join(__dirname, "output", req.params.file));
});

// START
app.listen(PORT, () => {
  console.log(`EasyPDF Pro running at http://localhost:${PORT}`);
});
