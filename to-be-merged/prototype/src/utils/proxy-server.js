const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
  try {
    const imageURL = req.query.url; // Get the image URL from the query params
    const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    res.setHeader('Content-Type', 'image/png'); // Set content type
    res.send(buffer); // Send image buffer as response
  } catch (error) {
    res.status(500).send('Error fetching image');
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
