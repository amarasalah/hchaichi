// downloadImage.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

const downloadImage = async (imageUrl, fileName) => {
  try {
    // Make a GET request to fetch the image
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // Define the path to save the image
    const filePath = path.join(__dirname, '..', 'uploads', 'ProfilesIMG', fileName);

    // Save the image data to the file
    await writeFileAsync(filePath, response.data);

    console.log(`Image downloaded and saved to ${filePath}`);
    
    return filePath;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

module.exports = downloadImage;
