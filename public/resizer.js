
const imageInput = document.getElementById("imageInput");
const resizeBtn = document.getElementById("resizeBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const percentRange = document.getElementById("percentRange");
const percentValue = document.getElementById("percentValue");

const percentBox = document.getElementById("percentBox");
const dimensionBox = document.getElementById("dimensionBox");

const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");

let img = new Image();

// Slider value update
percentRange.addEventListener("input", () => {
  percentValue.textContent = percentRange.value;
});

// Radio switch
document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "percent") {
      percentBox.style.display = "block";
      dimensionBox.style.display = "none";
    } else {
      percentBox.style.display = "none";
      dimensionBox.style.display = "block";
    }
  });
});

// Resize button
resizeBtn.addEventListener("click", () => {
  if (!imageInput.files.length) {
    alert("Please select an image");
    return;
  }

  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    img.onload = () => {
      let newWidth, newHeight;

      const mode = document.querySelector('input[name="mode"]:checked').value;

      if (mode === "percent") {
        const percent = percentRange.value / 100;
        newWidth = img.width * percent;
        newHeight = img.height * percent;
      } else {
        newWidth = parseInt(widthInput.value);
        newHeight = parseInt(heightInput.value);

        if (!newWidth || !newHeight) {
          alert("Enter valid width & height");
          return;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const link = document.createElement("a");
      link.download = "resized-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});
