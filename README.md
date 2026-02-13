# JEN Remodeling Inc - Next.js Website

A modern, SEO-optimized website for JEN Remodeling Inc built with Next.js 15 and React 19.

## 🚀 Features

- **Next.js 15** with App Router
- **React 19** for modern UI components
- **SEO Optimized** with metadata API
- **Server-Side Rendering** for better performance
- **TypeScript Ready** (optional)
- **GitHub Pages** deployment support

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static site (for GitHub Pages)
- `npm run deploy` - Deploy to GitHub Pages

## 📁 Project Structure

```
jen-remodeling-react/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx     # Root layout with Header/Footer
│   │   ├── page.tsx       # Home page
│   │   ├── projects/      # Projects page
│   │   ├── services/      # Services page
│   │   ├── reviews/       # Reviews page
│   │   └── contact/       # Contact page
│   ├── components/        # React components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Landing.js
│   │   ├── Projects.js
│   │   ├── Services.js
│   │   ├── Reviews.js
│   │   └── Contact.js
│   └── styles/           # Global styles
│       └── globals.css
├── public/               # Static assets
├── next.config.js        # Next.js configuration
└── package.json
```

## 🎯 Key Improvements from React to Next.js

1. **SEO Optimization**: Built-in metadata API for better search engine visibility
2. **Performance**: Server-side rendering and automatic code splitting
3. **Routing**: File-based routing (no React Router needed)
4. **Image Optimization**: Built-in Image component with automatic optimization
5. **Type Safety**: TypeScript support out of the box
6. **Better DX**: Improved developer experience with hot reloading

## 📝 Migration Notes

- All components now use Next.js `Link` instead of React Router `Link`
- Components with interactivity marked with `'use client'` directive
- Routing handled by Next.js App Router file structure
- SEO metadata added to each page via `metadata` export

## 🚀 Deployment

### GitHub Pages

1. Update `next.config.js` with your repository name
2. Run `npm run build` to create static export
3. Run `npm run deploy` to deploy to GitHub Pages

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically on push

## 📄 License

Private project for JEN Remodeling Inc
