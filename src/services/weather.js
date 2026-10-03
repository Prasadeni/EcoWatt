import { WEATHER_API_KEY } from '../data/config';

// No more live GPS. We accept location as parameter.
export async function fetchWeather(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return { error: true, message: 'No location set', icon: 'wb-cloudy' };
  }

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API failed');
    const json = await res.json();

    return {
      tempC: Math.round(json.main.temp),
      condition: json.weather[0].main,
      description: json.weather[0].description,
      cloudCover: json.clouds?.all ?? 0,
      rainfall: json.rain?.['1h'] ?? 0,
      city: json.name,
      icon: mapIcon(json.weather[0].main),
      fetchedAt: Date.now(),
    };
  } catch (e) {
    return { error: true, message: e.message, icon: 'wb-cloudy' };
  }
}

function mapIcon(condition) {
  const map = {
    Clear: 'wb-sunny',
    Clouds: 'wb-cloudy',
    Rain: 'water-drop',
    Drizzle: 'grain',
    Thunderstorm: 'flash-on',
    Snow: 'ac-unit',
    Mist: 'foggy',
    Fog: 'foggy',
    Haze: 'foggy',
  };
  return map[condition] || 'wb-cloudy';
}