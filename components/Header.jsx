import { Card, CardContent } from '@/components/ui/card';

export default function Header() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold text-center">Blog Summarizer App</h1>
        <p className="text-center mt-2">Enter a blog URL to generate and save summaries in English and Urdu</p>
      </CardContent>
    </Card>
  );
}