This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Setup

Copy the `.env.example` file to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual Supabase project URL and anonymous key.

## Deploy on Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Make sure your project is pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Have your Supabase credentials ready

### Deployment Steps

1. **Connect your repository to Vercel**:

   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your Git repository
   - Select the owner and repository

2. **Configure project settings**:

   - Framework Preset: Next.js
   - Root Directory: `./` (or the appropriate directory if your project is in a subfolder)
   - Build Command: (leave as default)
   - Output Directory: (leave as default)

3. **Set up environment variables**:

   - Click on "Environment Variables" section
   - Add the following variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anonymous key
     - `NEXT_PUBLIC_SITE_URL` = Your Vercel deployment URL (can be added after first deployment)

4. **Deploy**:

   - Click "Deploy"
   - Wait for the build and deployment to complete

5. **Verify Deployment**:
   - Once deployed, Vercel will provide a URL for your application
   - Visit the URL to ensure everything is working correctly

### Continuous Deployment

Vercel automatically sets up continuous deployment. Any changes pushed to your main branch will trigger a new deployment.

### Troubleshooting

If you encounter issues with your deployment:

1. Check the build logs in the Vercel dashboard
2. Verify your environment variables are correctly set
3. Ensure your Supabase project has the correct CORS configuration for your Vercel domain
4. Check for any serverless function timeouts or size limits

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
