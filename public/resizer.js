const imageInput = document.getElementById("imageInput");
const resizeBtn = document.getElementById("resizeBtn");
const percent = document.getElementById("percent");
const percentLabel = document.getElementById("percentLabel");

const percentBox = document.getElementById("percentBox");
const customBox = document.getElementById("customBox");

let selectedFile = null;

imageInput.addEventListener("change", e => {
  selectedFile = e.target.files[0];
});

document.querySelectorAll("input[name='mode']").forEach(radio => {
  radio.addEventListener("change", e => {
    if (e.target.value === "percent") {
      percentBox.style.display = "block";
      customBox.style.display = "none";
    } else {
      percentBox.style.display = "none";
      customBox.style.display = "block";
    }
  });
});

percent.addEventListener("input", () => {
  percentLabel.textContent = percent.value + "%";
});

resizeBtn.addEventListener("click", () => {
  if (!selectedFile) {
    alert("Select an image first");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => resizeImage(img);
    img.src = reader.result;
  };
  reader.readAsDataURL(selectedFile);
});

function resizeImage(img) {
  const canvas = document.createElement("canvas");
  let w = img.width;
  let h = img.height;

  const mode = document.querySelector("input[name='mode']:checked").value;

  if (mode === "percent") {
    const scale = percent.value / 100;
    w *= scale;
    h *= scale;
  } else {
    const newW = parseInt(document.getElementById("width").value);
    const newH = parseInt(document.getElementById("height").value);
    if (!newW || !newH) {
      alert("Enter width and height");
      return;
    }
    w = newW;
    h = newH;
  }

  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);

  canvas.toBlob(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resized-image.png";
    a.click();
  });
}

