// Expo combina app.json con este archivo: `config` trae el contenido de app.json.
// Aquí solo se inyecta la API key de Google Maps desde una variable de entorno,
// para que no quede escrita en el repositorio.
module.exports = ({ config }) => {
  const mapsKey = process.env.GOOGLE_MAPS_API_KEY

  if (!mapsKey) {
    console.warn(
      '[app.config] Falta GOOGLE_MAPS_API_KEY en .env: el mapa no cargará en un build de Android.'
    )
  }

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...(config.android && config.android.config),
        googleMaps: { apiKey: mapsKey },
      },
    },
  }
}