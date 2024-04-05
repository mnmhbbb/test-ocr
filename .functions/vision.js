const axios = require('axios');

exports.handler = async (event, _) => {
  if (event.httpMethod === 'POST') {
    const { base64Image } = JSON.parse(event.body);

    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`,
        {
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
            },
          ],
        }
      );

      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to call Vision API' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};