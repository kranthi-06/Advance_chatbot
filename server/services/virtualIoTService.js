export const fetchVirtualIoTData = async (coords = {}, locationContext = {}) => {
  const latitude = Number(coords.lat) || 20.5937;
  const longitude = Number(coords.lon) || 78.9629;
  const dayOfYear = getDayOfYear(new Date());

  // A lightweight India-focused simulation model that varies by region and season.
  const tropicalFactor = clamp(1 - Math.abs(latitude - 20) / 18, 0.2, 1);
  const coastalFactor = clamp(1 - Math.abs(longitude - 80) / 16, 0, 1);
  const mountainCooling = latitude > 30 ? 3.5 : latitude > 27 ? 1.5 : 0;
  const summerWave = Math.sin(((dayOfYear - 70) / 365) * Math.PI * 2);
  const monsoonWave = Math.max(0, Math.sin(((dayOfYear - 145) / 365) * Math.PI * 2));

  const seed =
    latitude * 19.37 +
    longitude * 7.91 +
    dayOfYear * 0.83 +
    hashString(locationContext.stateKey || '') * 0.0003 +
    hashString(locationContext.cityName || '') * 0.0007;

  const noise = (offset) => pseudoRandom(seed + offset) - 0.5;

  const temperature = clamp(
    22 + tropicalFactor * 8 + summerWave * 4 - mountainCooling + noise(1) * 3.4,
    9,
    42
  );
  const humidity = clamp(
    48 + coastalFactor * 12 + monsoonWave * 24 + noise(2) * 10,
    24,
    96
  );
  const rainfall = clamp(
    10 + monsoonWave * 205 + coastalFactor * 18 + noise(3) * 22,
    0,
    320
  );
  const soilMoisture = clamp(
    22 + humidity * 0.24 + rainfall * 0.08 + noise(4) * 8,
    14,
    88
  );
  const airQualityIndex = Math.round(
    clamp(44 + (1 - coastalFactor) * 18 + (temperature - 28) * 1.6 + noise(5) * 18, 18, 165)
  );

  return {
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    rainfall: Number(rainfall.toFixed(1)),
    soilMoisture: Number(soilMoisture.toFixed(1)),
    airQualityIndex,
    isSimulated: true,
    simulationMode: 'india-regional-model',
    observedAt: new Date().toISOString(),
  };
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDayOfYear(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
