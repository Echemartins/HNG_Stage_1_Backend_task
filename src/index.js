const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.socket.remoteAddress || req.ip;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const locationResponse = await axios.get('http://ip-api.com/json/');
    const city = locationResponse.data.city;
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const temp = weatherResponse.data.main.temp;

    res.status(200).json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temp} degrees Celsius in ${city}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch location data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
