let img = new Image();

document.getElementById("fileInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => img.src = ev.target.result;
  reader.readAsDataURL(file);
});

document.querySelectorAll("input[name='mode']").forEach(radio => {
  radio.addEventListener("change", () => {
    document.getElementById("percentBox").style.display =
      radio.value === "percent" && radio.checked ? "block" : "none";
    document.getElementById("customBox").style.display =
      radio.value === "custom" && radio.checked ? "block" : "none";
  });
});

document.getElementById("percentRange").addEventListener("input", e => {
  document.getElementById("percentValue").innerText = e.target.value;
});

function resizeImage() {
  if (!img.src) {
    alert("Please select an image");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let width, height;
  const percent = document.getElementById("percentRange").value;

  if (document.querySelector("input[value='percent']").checked) {
    width = img.width * percent / 100;
    height = img.height * percent / 100;
  } else {
    width = parseInt(document.getElementById("widthInput").value);
    height = parseInt(document.getElementById("heightInput").value);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const link = document.createElement("a");
  link.download = "resized-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
