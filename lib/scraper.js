import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeBlog(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const text = $('p').text().replace(/\s+/g, ' ').trim();
    return text;
  } catch (error) {
    throw new Error(`Scraping error: ${error.message}`);
  }
}