import { BlogSummarizerForm } from "@/components/blog-summarizer-form"
import { RecentSummaries } from "@/components/recent-summaries"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Blog Summarizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform lengthy blog posts into concise summaries with Urdu translation. Powered by intelligent text
            processing and multilingual support for enhanced content accessibility.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🤖 AI-Powered Summarization
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              🌐 Urdu Translation
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              💾 Smart Storage
            </span>
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              ⚡ Real-time Processing
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <BlogSummarizerForm />

            {/* How it works section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">1. Input URL</h3>
                  <p className="text-sm text-gray-600">Paste any blog post URL to get started</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">2. AI Processing</h3>
                  <p className="text-sm text-gray-600">Our AI extracts and summarizes key content</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🌍</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">3. Translation</h3>
                  <p className="text-sm text-gray-600">Get summaries in both English and Urdu</p>
                </div>
              </div>
            </div>

            {/* Features section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Smart Summarization</h3>
                    <p className="text-sm text-gray-600">Advanced algorithms identify key insights and main points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Dual Language Support</h3>
                    <p className="text-sm text-gray-600">Comprehensive English to Urdu translation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">💾</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Secure Storage</h3>
                    <p className="text-sm text-gray-600">Summaries saved in Supabase, full text in MongoDB</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Responsive Design</h3>
                    <p className="text-sm text-gray-600">Works seamlessly across all devices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RecentSummaries />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm">Built with ❤️ using Next.js, Supabase, and MongoDB</p>
            <p className="text-xs mt-2 opacity-75">Empowering content accessibility through AI-powered summarization</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
