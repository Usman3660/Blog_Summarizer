import { scrapeBlog } from './scraper';
import { saveSummary } from './supabase';
import { saveFullText } from './mongodb';

export async function summarizeBlog(url) {
  const fullText = await scrapeBlog(url);
  const summary = fullText.split(' ').slice(0, 100).join(' ').substring(0, 200) + '...';
  await saveSummary(url, summary);
  await saveFullText(url, fullText);
  return { summary, fullText };
}