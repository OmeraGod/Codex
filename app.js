const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const statusEl = document.getElementById('status');
const card = document.getElementById('weather-card');

const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const windSpeedEl = document.getElementById('wind-speed');
const updatedTimeEl = document.getElementById('updated-time');

const weatherCodeMap = {
  0: 'Trời quang',
  1: 'Nắng nhẹ',
  2: 'Ít mây',
  3: 'Nhiều mây',
  45: 'Sương mù',
  48: 'Sương mù đóng băng',
  51: 'Mưa phùn nhẹ',
  53: 'Mưa phùn vừa',
  55: 'Mưa phùn nặng hạt',
  61: 'Mưa nhẹ',
  63: 'Mưa vừa',
  65: 'Mưa to',
  71: 'Tuyết nhẹ',
  73: 'Tuyết vừa',
  75: 'Tuyết dày',
  80: 'Mưa rào nhẹ',
  81: 'Mưa rào vừa',
  82: 'Mưa rào mạnh',
  95: 'Dông',
  96: 'Dông kèm mưa đá',
  99: 'Dông kèm mưa đá lớn'
};

function setStatus(message) {
  statusEl.textContent = message;
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function removeAccents(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

async function fetchLocation(query, includeVietnameseLanguage = true) {
  const params = new URLSearchParams({
    name: query,
    count: '1',
    format: 'json'
  });

  if (includeVietnameseLanguage) {
    params.set('language', 'vi');
  }

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Không thể tìm kiếm địa điểm lúc này.');
  }

  const data = await response.json();
  return data.results && data.results.length > 0 ? data.results[0] : null;
}

async function getCoordinates(city) {
  const attempts = [
    () => fetchLocation(city, true),
    () => fetchLocation(city, false),
    () => fetchLocation(removeAccents(city), false)
  ];

  for (const tryFind of attempts) {
    const result = await tryFind();
    if (result) {
      return result;
    }
  }

  throw new Error('Không tìm thấy thành phố. Hãy thử nhập tên không dấu hoặc tên tiếng Anh.');
}

async function getCurrentWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Không lấy được dữ liệu thời tiết.');
  }

  const data = await response.json();
  return data.current;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    setStatus('Vui lòng nhập tên thành phố.');
    return;
  }

  card.classList.add('hidden');
  setStatus('Đang tải dữ liệu thời tiết...');

  try {
    const place = await getCoordinates(city);
    const weather = await getCurrentWeather(place.latitude, place.longitude);

    cityNameEl.textContent = `${place.name}, ${place.country}`;
    temperatureEl.textContent = weather.temperature_2m;
    descriptionEl.textContent = weatherCodeMap[weather.weather_code] ?? 'Không xác định';
    windSpeedEl.textContent = weather.wind_speed_10m;
    updatedTimeEl.textContent = formatTime(weather.time);

    card.classList.remove('hidden');
    setStatus('Dữ liệu mới nhất đã được cập nhật.');
  } catch (error) {
    setStatus(error.message || 'Đã xảy ra lỗi.');
  }
});
