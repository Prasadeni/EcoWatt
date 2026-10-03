// Sri Lankan cities with coordinates
// User picks their solar installation location once during setup.
export const SRI_LANKA_CITIES = [
  { name: 'Galle',         lat: 6.0535,  lon: 80.2210 },
  { name: 'Colombo',       lat: 6.9271,  lon: 79.8612 },
  { name: 'Kandy',         lat: 7.2906,  lon: 80.6337 },
  { name: 'Matara',        lat: 5.9485,  lon: 80.5353 },
  { name: 'Jaffna',        lat: 9.6615,  lon: 80.0255 },
  { name: 'Negombo',       lat: 7.2081,  lon: 79.8358 },
  { name: 'Anuradhapura',  lat: 8.3114,  lon: 80.4037 },
  { name: 'Kurunegala',    lat: 7.4867,  lon: 80.3647 },
  { name: 'Ratnapura',     lat: 6.6828,  lon: 80.3992 },
  { name: 'Badulla',       lat: 6.9934,  lon: 81.0550 },
  { name: 'Batticaloa',    lat: 7.7170,  lon: 81.7000 },
  { name: 'Trincomalee',   lat: 8.5874,  lon: 81.2152 },
];

// Default fallback if user skips setup
export const DEFAULT_LOCATION = SRI_LANKA_CITIES[0]; // Galle