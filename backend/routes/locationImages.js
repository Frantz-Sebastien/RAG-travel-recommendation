import express from 'express';
import axios from 'axios';

const router = express.Router();

// We'll read these from .env
const IMAGE_API_KEY = process.env.IMAGE_API_KEY;
const CSE_ID = process.env.CSE_ID;

// GET route to fetch images for a given location using Google Custom Search
router.get('/location-images', async (req, res) => {
  try {
    const { locationName } = req.query;

    if (!locationName) {
      return res.status(400).json({ error: 'locationName query parameter is required' });
    }

    // Build the URL for Google’s Custom Search JSON API
    // Documentation: https://developers.google.com/custom-search/v1/using_rest
    const url = 'https://www.googleapis.com/customsearch/v1';

    const params = {
      key: IMAGE_API_KEY,         // API key
      cx: CSE_ID,                 // Search Engine ID
      q: locationName,            // The search query
      searchType: 'image',        // Tells Google to return images only
      num: 10,                     // Limit how many image results
      safe: "active",             // Keep the image family-friendly
      imgType: "photo"            // Filter out memes, clipart, logos and stuff...
      // Optional: imgSize, fileType, etc. I do not know how to do that part properly yet
    };

    // Make the request to Google’s Custom Search API
    const response = await axios.get(url, { params });
    // The items array in the response data holds the search results
    const { items } = response.data;

    if (!items || items.length === 0) {
      return res.json({ images: [], message: 'No images found for this location' });
    }

    // Extract the image URLs. 
    // Each item typically has a "link" field that contains the image URL.
    const randomImageUrls = items.map(item => item.link);

    //This function is fixing the duplicate issue.
    const extractFileName = (url) => {
        try {
          const cleanUrl = new URL(url);
          return cleanUrl.pathname.split('/').pop(); // get the last part after the last slash
        } catch {
          return url; // fallback
        }
      };
      
      const seenFileNames = new Set();
      const uniqueUrls = [];
      
      for (const url of randomImageUrls) {
        const fileName = extractFileName(url);
      
        if (!seenFileNames.has(fileName)) {
          seenFileNames.add(fileName);
          uniqueUrls.push(url);
        }
      }

    const imageUrls = uniqueUrls.slice(0, 6) //Limit to 6 unique images

    // Return the array of image URLs to the frontend
    return res.json({ images: imageUrls });
  } catch (error) {
    console.error('Error fetching images from Google Custom Search:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to fetch location images' });
  }
});

const locationImagesRoutes = router

export default locationImagesRoutes;
