const imageInput = document.getElementById("imageInput");
const resizeBtn = document.getElementById("resizeBtn");
const percentRange = document.getElementById("percentRange");
const percentValue = document.getElementById("percentValue");
const percentControls = document.getElementById("percentControls");
const pxControls = document.getElementById("pxControls");

let selectedImage = null;

imageInput.addEventListener("change", (e) => {
  selectedImage = e.target.files[0];
});

document.querySelectorAll("input[name='mode']").forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "percent") {
      percentControls.style.display = "block";
      pxControls.style.display = "none";
    } else {
      percentControls.style.display = "none";
      pxControls.style.display = "block";
    }
  });
});

percentRange.addEventListener("input", () => {
  percentValue.textContent = percentRange.value;
});

resizeBtn.addEventListener("click", () => {
  if (!selectedImage) {
    alert("Please select an image");
    return;
  }

  const img = new Image();
  const reader = new FileReader();

  reader.onload = (e) => {
    img.src = e.target.result;
  };

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const mode = document.querySelector("input[name='mode']:checked").value;

    let newWidth, newHeight;

    if (mode === "percent") {
      const scale = percentRange.value / 100;
      newWidth = img.width * scale;
      newHeight = img.height * scale;
    } else {
      newWidth = document.getElementById("widthInput").value;
      newHeight = document.getElementById("heightInput").value;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    const link = document.createElement("a");
    link.download = "resized-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  reader.readAsDataURL(selectedImage);
});
