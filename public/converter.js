function convertImage() {
  const input = document.getElementById("inputImage");
  const format = document.getElementById("format").value;

  if (!input.files.length) {
    alert("Please select an image");
    return;
  }

  const file = input.files[0];
  const img = new Image();
  const reader = new FileReader();

  reader.onload = () => {
    img.src = reader.result;
  };

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);

      const ext =
        format === "image/png" ? "png" :
        format === "image/webp" ? "webp" : "jpg";

      a.download = "converted-image." + ext;
      a.click();
    }, format, 0.92);
  };

  reader.readAsDataURL(file);
}
