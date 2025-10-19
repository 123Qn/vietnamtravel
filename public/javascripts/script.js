document.addEventListener('DOMContentLoaded', () => {
  // --- Discover button ---
  const btn = document.getElementById('destinationButton');
  if (btn) {
    btn.addEventListener('click', () => {
      window.location.href = '/discover';
    });
  }

  // --- Image slider ---
  const images = [
    '/images/s1.jpg',
    '/images/s2.jpg',
    '/images/s3.jpg',
    '/images/s4.jpg'
  ];
  const slide = document.getElementById('slide');
  let index = 0;

  function nextImage() {
    index = (index + 1) % images.length;
    slide.style.opacity = 0;
    setTimeout(() => {
      slide.src = images[index];
      slide.style.opacity = 1;
    }, 500);
  }
  if (slide) setInterval(nextImage, 2000);

  // --- Sort & Search ---
  const cityGrid = document.getElementById('cityGrid');
  const sortSelect = document.getElementById('citySort');
  const searchInput = document.getElementById('citySearch');
  if (!cityGrid) return;

  let citiesData = [...cityGrid.querySelectorAll('.grid-item')];

  function updateGrid() {
    const searchText = searchInput?.value.toLowerCase() || '';
    let filtered = citiesData.filter(city => {
      const name = city.querySelector('h3').innerText.toLowerCase();
      return name.includes(searchText);
    });

    const sortOption = sortSelect?.value || 'name-asc';
    filtered.sort((a, b) => {
      const nameA = a.querySelector('h3').innerText.toLowerCase();
      const nameB = b.querySelector('h3').innerText.toLowerCase();
      return sortOption === 'name-asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    filtered.forEach(city => cityGrid.appendChild(city));

    // Hide non-matching
    citiesData.forEach(city => {
      city.style.display = filtered.includes(city) ? '' : 'none';
    });
  }

  sortSelect?.addEventListener('change', updateGrid);
  searchInput?.addEventListener('input', updateGrid);
  
});
