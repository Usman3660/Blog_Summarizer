# Blog Summarizer

A modern web application that transforms lengthy blog posts into concise summaries with Urdu translation capabilities. Built with Next.js 14, featuring AI-powered text processing and multilingual support.

## Features

- **Smart Web Scraping**: Extracts content from any blog URL
- **AI-Powered Summarization**: Uses advanced algorithms to create concise summaries
- **Urdu Translation**: Automatic translation using comprehensive dictionary
- **Dual Database Storage**: Summaries in Supabase, full text in MongoDB
- **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Processing**: Live updates during summarization process

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI Components**: ShadCN UI, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Databases**: Supabase (PostgreSQL), MongoDB
- **Web Scraping**: Cheerio
- **Deployment**: Vercel

## Project Structure

```
assignment-2/
├── app/
│   ├── api/
│   │   ├── summarize/route.ts    # Main summarization endpoint
│   │   └── summaries/route.ts    # Fetch recent summaries
│   ├── globals.css               # Global styles with Urdu font support
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Home page
├── components/
│   ├── blog-summarizer-form.tsx # Main form component
│   ├── recent-summaries.tsx     # Recent summaries display
│   └── ui/                      # ShadCN UI components
├── lib/
│   ├── summarizer.ts           # Static AI summarization logic
│   ├── translator.ts           # English to Urdu translation
│   ├── mongodb.ts              # MongoDB connection utility
│   └── supabase.ts             # Supabase connection utility
├── scripts/
│   └── create-supabase-tables.sql # Database schema
└── package.json
```

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Usman3660/Blog_Summarizer.git
    cd assignment-2
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup (Supabase & MongoDB Atlas)**

    *   **Supabase**:
        1.  Create a new project on [Supabase](https://supabase.com/).
        2.  Go to "SQL Editor" and run the script from `scripts/create-supabase-tables.sql` to set up the `summaries` table and Row Level Security (RLS) policies.
        3.  Go to "Project Settings" -> "API" to find your API keys and URL.

    *   **MongoDB Atlas**:
        1.  Sign up/Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
        2.  Create a **Shared Cluster (M0 Tier)**.
        3.  Create a **Database User** (e.g., `muhammadusmananwar50`) with a strong password. **Remember this password!**
        4.  Configure **Network Access**: Add your current IP address for local development, and for Vercel deployment, add `0.0.0.0/0` (Allow Access from Anywhere).
        5.  Get your **Connection String (URI)** from the "Connect" -> "Drivers" section. It will look like `mongodb+srv://<username>:<password>@yourcluster.mongodb.net/?retryWrites=true&w=majority`.

4.  **Environment Variables Configuration**

    *   **Create `.env.local` file**:
        Create a file named `.env.local` in the root of your project.
        Fill it with your database credentials. **Ensure the `MONGODB_URI` includes your actual password (URL-encoded if it contains special characters like `@`) and your database name (`user`) at the end.**

        ```env
        # Supabase Configuration
        NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here_starts_with_eyJ
        SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here_starts_with_eyJ

        # MongoDB Configuration
        MONGODB_URI=mongodb+srv://muhammadusmananwar50:YOUR_ACTUAL_MONGODB_PASSWORD@cluster0.kaywbxs.mongodb.net/user?retryWrites=true&w=majority
        ```
        *Replace `YOUR_ACTUAL_MONGODB_PASSWORD` with your MongoDB user's password (e.g., if your password is `usman@1122`, use `usman%401122`).*

    *   **Vercel Environment Variables (for Deployment)**:
        For your application to work when deployed on Vercel, you **must** add all these environment variables directly in your Vercel project settings:
        1.  Go to your Vercel Dashboard -> Your Project -> Settings -> Environment Variables.
        2.  Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `MONGODB_URI`.
        3.  Ensure they are configured for "Production", "Preview", and "Development" environments.

5.  **Run the application (Local Development)**

    *   **For `npm run dev` (recommended for local development)**:
        ```bash
        npm run dev
        ```
        This command automatically loads variables from `.env.local`.

    *   **For `npm run build` and `npm start` (for local production testing)**:
        The `.env.local` file is **not** automatically loaded. You must set the environment variables in your terminal session before running these commands.

        **For PowerShell (Windows):**
        ```powershell
        $env:NEXT_PUBLIC_SUPABASE_URL="<your_supabase_url>"; $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="<your_supabase_anon_key>"; $env:SUPABASE_SERVICE_ROLE_KEY="<your_supabase_service_role_key>"; $env:MONGODB_URI="<your_mongodb_uri>"; npm run build && npm start
        ```
        *Replace `<your_supabase_url>`, `<your_supabase_anon_key>`, `<your_supabase_service_role_key>`, and `<your_mongodb_uri>` with your actual, complete values.*

6.  **Open your browser**
    Navigate to `http://localhost:3000`
    **For Vercel**
    https://blog-summarizer-one.vercel.app/

## Usage

1.  **Enter Blog URL**: Paste any blog post URL in the input field
2.  **Process**: Click "Summarize Blog" to start processing
3.  **View Results**: See the English summary and Urdu translation
4.  **Browse History**: Check recent summaries in the sidebar

## Key Features Explained

### Smart Summarization Algorithm
- Analyzes sentence importance based on keywords
- Considers sentence position and length
- Extracts key insights while maintaining readability

### Urdu Translation System
- Comprehensive English-to-Urdu dictionary (1000+ words)
- Preserves punctuation and formatting
- Right-to-left text display support

### Database Architecture
- **Supabase**: Stores summaries for quick retrieval and display
- **MongoDB**: Archives full blog text for comprehensive storage in the `user` database, `full_texts` collection.
- **Optimized Queries**: Indexed for fast performance

### UI/UX Design
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Visual feedback during processing
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and semantic HTML

## Deployment

### Vercel Deployment
1.  **Connect Repository**: Link your GitHub repository to Vercel
2.  **Environment Variables**: Add all required environment variables (as described in step 4 above)
3.  **Deploy**: Automatic deployment on push to main branch

## API Endpoints

### POST /api/summarize
Processes a blog URL and returns summary with translation.

**Request Body:**
```json
{
  "url": "https://example.com/blog-post"
}
```

**Response:**
```json
{
  "title": "Blog Post Title",
  "url": "https://example.com/blog-post",
  "originalText": "Full blog content...",
  "summary": "Concise English summary...",
  "urduSummary": "اردو خلاصہ..."
}
```

### GET /api/summaries
Retrieves recent summaries from Supabase.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Blog Title",
    "url": "https://example.com/blog",
    "summary": "Summary text...",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

## Performance Optimizations

- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next.js Image component with lazy loading
- **Database Indexing**: Optimized queries for fast retrieval
- **Caching**: Strategic caching for improved performance
- **Code Splitting**: Automatic route-based code splitting

## Security Considerations

- **Input Validation**: URL validation and sanitization
- **Rate Limiting**: Prevents abuse of summarization endpoint
- **Environment Variables**: Secure storage of API keys
- **CORS Protection**: Configured for production domains
- **SQL Injection Prevention**: Parameterized queries

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1.  Fork the repository
2.  Create a feature branch
3.  Make your changes
4.  Add tests if applicable
5.  Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

Built with ❤️ using Next.js, Supabase, and MongoDB
