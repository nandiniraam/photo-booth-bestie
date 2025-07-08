let count = 0;
let photoData = [];

Webcam.set({
  width: 320,
  height: 240,
  image_format: 'jpeg',
  jpeg_quality: 90
});
Webcam.attach('#camera');

function takeSnapshot() {
  if (count < 3) {
    Webcam.snap(function(data_uri) {
      document.getElementById(`photo${count + 1}`).src = data_uri;
      photoData.push(data_uri);
      count++;
    });
  } else {
    alert("All 3 photos captured! 🥳");
  }
}

function sendPhotos() {
  if (photoData.length < 3) {
    alert("Please take all 3 photos first!");
    return;
  }

  ffetch('https://your-backend-url.onrender.com/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ photos: photoData })
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);

  // Create and click the anchor tag dynamically
  const a = document.createElement('a');
  a.href = url;
  a.download = 'photo-strip.pdf';

  // 📱 Mobile-friendly fix: add to DOM before clicking
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
})
.catch(error => {
  alert("Something went wrong while downloading the PDF. Try again!");
  console.error(error);
});
}