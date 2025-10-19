document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('destinationButton');
  if (btn) {
    btn.addEventListener('click', () => {
      window.location.href = '#';
    });
  }
// image slider 
const images = [
    '/images/s1.jpg',
    '/images/s2.jpg',
    '/images/s3.jpg',
    '/images/s4.jpg'
  ];

  const slide = document.getElementById('slide');
  let index = 0;

  function nextImage() {
    index = (index + 1) % images.length; // loop back to 0 after last
    slide.style.opacity = 0;             // fade out

    setTimeout(() => {
      slide.src = images[index];         // change image
      slide.style.opacity = 1;           // fade in
    }, 500); // half second fade
  }

  setInterval(nextImage, 2000); // change every 2 seconds
});
