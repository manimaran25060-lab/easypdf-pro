const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const percent = document.getElementById("percent");
const percentValue = document.getElementById("percentValue");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

percent.oninput = () => percentValue.textContent = percent.value + "%";
quality.oninput = () => qualityValue.textContent = quality.value + "%";

let img = new Image();

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => img.src = reader.result;
  reader.readAsDataURL(file);
});

function resizeImage() {
  if (!img.src) {
    alert("Please upload an image first");
    return;
  }

  const mode = document.querySelector("input[name='mode']:checked").value;

  let newWidth, newHeight;

  if (mode === "percent") {
    const scale = percent.value / 100;
    newWidth = img.width * scale;
    newHeight = img.height * scale;
  } else {
    newWidth = document.getElementById("width").value;
    newHeight = document.getElementById("height").value;
    if (!newWidth || !newHeight) {
      alert("Enter width and height");
      return;
    }
  }

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  const download = document.getElementById("download");
  download.href = canvas.toDataURL("image/jpeg", quality.value / 100);
  download.style.display = "block";
}
