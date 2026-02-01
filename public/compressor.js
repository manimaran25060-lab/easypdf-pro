const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const info = document.getElementById("info");

quality.oninput = () => qualityValue.textContent = quality.value + "%";

let img = new Image();
let originalSize = 0;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  originalSize = (file.size / 1024).toFixed(2);

  const reader = new FileReader();
  reader.onload = () => img.src = reader.result;
  reader.readAsDataURL(file);
});

function compressImage() {
  if (!img.src) {
    alert("Please upload an image first");
    return;
  }

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  const compressedData = canvas.toDataURL(
    "image/jpeg",
    quality.value / 100
  );

  const compressedSize = (
    (compressedData.length * 3) / 4 / 1024
  ).toFixed(2);

  info.innerHTML = `
    Original Size: <b>${originalSize} KB</b><br>
    Compressed Size: <b>${compressedSize} KB</b>
  `;

  const download = document.getElementById("download");
  download.href = compressedData;
  download.style.display = "block";
}
