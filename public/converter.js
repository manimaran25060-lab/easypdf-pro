const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const formatInfo = document.getElementById("formatInfo");

let img = new Image();
let outputFormat = "image/png";

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type === "image/jpeg") {
    outputFormat = "image/png";
    formatInfo.innerHTML = "Input: JPG → Output: PNG";
  } else if (file.type === "image/png") {
    outputFormat = "image/jpeg";
    formatInfo.innerHTML = "Input: PNG → Output: JPG";
  } else {
    alert("Only JPG or PNG allowed");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => img.src = reader.result;
  reader.readAsDataURL(file);
});

function convertImage() {
  if (!img.src) {
    alert("Please upload an image first");
    return;
  }

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const dataURL = canvas.toDataURL(
    outputFormat,
    outputFormat === "image/jpeg" ? 0.95 : undefined
  );

  const download = document.getElementById("download");
  download.href = dataURL;
  download.download =
    outputFormat === "image/png"
      ? "converted.png"
      : "converted.jpg";

  download.style.display = "block";
}
