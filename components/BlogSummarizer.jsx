import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { translateToUrdu } from '@/lib/translator';

export default function BlogSummarizer() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [urduSummary, setUrduSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url) {
      toast.error('Please enter a valid blog URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to summarize blog');

      const data = await response.json();
      setSummary(data.summary);
      setUrduSummary(translateToUrdu(data.summary));
      toast.success('Blog summarized and saved successfully!');
    } catch (error) {
      toast.error('Error summarizing blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Blog Summarizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Blog URL
              </label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/blog"
                className="mt-1"
                aria-required="true"
              />
            </div>
            <Button
              onClick={handleSummarize}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              Summarize
            </Button>
            {summary && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">English Summary</label>
                  <Textarea value={summary} readOnly className="mt-1 h-32" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Urdu Summary</label>
                  <Textarea value={urduSummary} readOnly className="mt-1 h-32 font-noto" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}