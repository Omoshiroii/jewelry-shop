# Lumière Jewels - Project Summary & Technical Documentation

## Project Overview

**Project Name:** Lumière Jewels (LILOOK)  
**Version:** 0.1.0  
**Type:** Full-stack e-commerce web application for Moroccan artisanal jewelry  
**Status:** Active development (deployed on Vercel)  

### Business Purpose
A modern, luxury jewelry e-commerce platform specializing in artisanal Moroccan pieces. The brand targets women who appreciate elegant, handcrafted jewelry with romantic details. The tagline "Bijoux qui murmurent l'élégance" (Jewelry that whispers elegance) captures the brand positioning.

---

## Technology Stack & Framework

### Core Framework
- **Next.js 16.2.4** - React-based full-stack web framework with App Router (latest)
- **React 19.2.4** - UI library
- **TypeScript 5.9.3** - Type-safe language superset
- **Node.js** - Runtime environment

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS 4** - CSS transformations with @tailwindcss/postcss
- **Framer Motion 12.38.0** - Animation and motion library
- **Lucide React 1.11.0** - Icon library
- **Embla Carousel React 8.6.0** - Carousel/slider component for image galleries

### Database & Backend
- **Supabase** - Open-source Firebase alternative
  - `@supabase/supabase-js` (2.104.1) - JavaScript client library
  - `@supabase/ssr` (0.10.2) - Server-side rendering support
  - PostgreSQL database (managed)
  - Built-in authentication

### Development Tools
- **ESLint 9** - Code linting & quality
- **eslint-config-next** - Next.js ESLint configuration

---

## Project Architecture

### File Structure & Organization

```
lumiere-jewels/
├── app/                          # Next.js App Router (server & client components)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout wrapper
│   ├── page.tsx                 # Homepage (main shop view)
│   ├── admin/
│   │   ├── page.tsx            # Admin login page
│   │   └── dashboard/
│   │       └── page.tsx        # Admin dashboard (product management)
│   ├── catalogue/
│   │   └── page.tsx            # Full catalogue view
│   └── product/
│       └── [id]/
│           └── page.tsx        # Individual product detail page
│
├── components/                   # Reusable React components
│   ├── BottomNav.tsx           # Mobile bottom navigation
│   ├── Navbar.tsx              # Header/navigation bar
│   ├── CategoryFilter.tsx       # Category filtering component
│   ├── ProductCard.tsx          # Individual product card
│   ├── ProductGrid.tsx          # Grid layout for products
│   ├── ImageCarousel.tsx        # Product image carousel
│   └── admin/
│       ├── ProductForm.tsx      # Admin form for creating/editing products
│       └── ProductList.tsx      # Admin list view of products
│
├── hooks/                        # Custom React hooks
│   └── useProducts.ts           # Hook for fetching products
│
├── lib/                          # Utility & configuration libraries
│   ├── supabase.ts             # Supabase browser client initialization
│   ├── supabase-server.ts      # Supabase server-side client
│   └── utils.ts                # Utility functions (pricing, formatting)
│
├── types/                        # TypeScript type definitions
│   └── index.ts                # Product & Category types
│
├── public/                       # Static assets (images, fonts, etc.)
│
├── Configuration Files
│   ├── tsconfig.json           # TypeScript configuration
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── postcss.config.mjs      # PostCSS configuration
│   ├── eslint.config.mjs       # ESLint rules
│   ├── package.json            # Dependencies & scripts
│   ├── next-env.d.ts           # Generated Next.js types
│   ├── AGENTS.md               # AI agent instructions
│   └── CLAUDE.md               # (Reference or future use)
```

---

## Data Model & Database Schema

### Product Type Definition
```typescript
export type Category = 
  | 'bagues'       // Rings
  | 'colliers'     // Necklaces
  | 'bracelets'    // Bracelets
  | 'boucles'      // Earrings
  | 'traditionnel' // Traditional pieces
  | 'pendentifs'   // Pendants
  | 'ensembles'    // Sets
  | 'autres'       // Other

export type Product = {
  id: string
  title: string
  description: string | null
  original_price: number
  discount_percentage: number
  category: Category
  images: string[]           // Array of image URLs
  is_trending: boolean       // Featured on homepage
  created_at: string         // ISO timestamp
}
```

### Supabase Tables
- **products** table - Stores all jewelry items
- **auth** system - Built-in user authentication for admin access

---

## Core Features & Pages

### Public Pages

#### 1. **Homepage (`/` - page.tsx)**
- **Purpose:** Primary shop interface
- **Key Features:**
  - Fixed navigation bar with app logo and admin link
  - Hero section with brand messaging
  - Category filter system (`'tout'` shows all, individual categories filter products)
  - Product grid display with real-time filtering
  - Trending products section
  - Responsive layout optimized for mobile
- **State Management:** React hooks (useState, useEffect)
- **Data Flow:** Fetches products from Supabase based on selected category
- **Styling:** Inline CSS with custom color palette (beige: #f7f2ec, brown: #2f2723, gold: #c8a27b)

#### 2. **Product Detail Page (`/product/[id]` - [id]/page.tsx)**
- **Purpose:** Individual product showcase
- **Expected Features:** (Implementation details needed)
  - Full product information
  - Image carousel gallery
  - Price display with discount calculation
  - Add to cart functionality (pending)

#### 3. **Catalogue Page (`/catalogue` - page.tsx)**
- **Purpose:** Alternative browsing experience
- **Expected Features:** (Implementation details needed)
  - Comprehensive product listing
  - Advanced filtering options
  - Sorting capabilities

### Admin Pages

#### 1. **Admin Login (`/admin` - page.tsx)**
- **Purpose:** Authenticate admin users
- **Features:**
  - Email & password input fields
  - Error messaging in French
  - Redirects to dashboard on successful login
  - Supabase authentication integration
  - Branded login interface matching store aesthetic

#### 2. **Admin Dashboard (`/admin/dashboard` - page.tsx)**
- **Purpose:** Product management interface
- **Expected Features:**
  - Product CRUD operations (Create, Read, Update, Delete)
  - Inventory management
  - Price & discount management
  - Image management
  - Analytics/sales data (pending)

---

## Component Architecture

### Reusable Components

#### **ProductCard.tsx**
- Displays individual product in grid
- Shows: image, title, price, discount badge
- Links to product detail page
- Responsive sizing

#### **ProductGrid.tsx**
- Container for multiple ProductCard components
- Responsive grid layout
- Handles empty states

#### **ImageCarousel.tsx**
- Multi-image display for products
- Navigation controls
- Uses Embla Carousel React library
- Smooth transitions with Framer Motion

#### **CategoryFilter.tsx**
- Renders category buttons
- Filters products on selection
- Highlights active category

#### **Navbar.tsx**
- Fixed header navigation
- Brand logo display
- Admin menu access
- Glassmorphic design with blur effect

#### **BottomNav.tsx**
- Mobile footer navigation
- Alternative navigation method for small screens

### Admin Components

#### **ProductForm.tsx**
- Form for creating/editing products
- Fields: title, description, price, discount, category, images
- Validation before submission
- Integrates with Supabase

#### **ProductList.tsx**
- Tabular display of all products
- Edit/delete actions
- Pagination (if applicable)

---

## Key Utility Functions

### `lib/utils.ts`
- **`getSalePrice(originalPrice, discountPercentage)`** 
  - Calculates discounted price
  - Formula: `price * (1 - discount / 100)`

- **`formatPrice(price)`** 
  - Formats to Moroccan Dirham (MAD)
  - Locale: French-Moroccan
  - Removes decimal places: `1500 MAD`

- **`hasDiscount(discountPercentage)`** 
  - Boolean check for discount presence

### `hooks/useProducts.ts`
- Custom hook for product fetching logic
- Abstracts Supabase queries
- Manages loading/error states

---

## Authentication & Backend Services

### Supabase Integration

#### Client Configuration (`lib/supabase.ts`)
```typescript
- Browser client using @supabase/ssr
- Initializes with public Supabase URL & anon key from .env
- Used for all client-side database operations
```

#### Server Configuration (`lib/supabase-server.ts`)
```typescript
- Server-side client for backend operations
- Handles protected operations
- May be used in API routes (if implemented)
```

### Authentication Flow
1. Admin enters credentials in `/admin` login page
2. `supabase.auth.signInWithPassword()` validates against Supabase Auth
3. On success: redirect to `/admin/dashboard`
4. Session maintained in browser storage
5. Protected routes check auth status before rendering

---

## Design System & Branding

### Color Palette
- **Primary Background:** `#f7f2ec` (warm beige)
- **Text Primary:** `#2f2723` (deep brown)
- **Text Secondary:** `#8e7f74` (muted brown)
- **Accent Gold:** `#c8a27b` (warm gold)
- **Light Background:** `rgba(255,255,255,0.7)` (semi-transparent white with blur)

### Typography
- **Brand Font:** Cormorant Garamond (serif) - elegant, luxury feel
- **Body Font:** Inter (sans-serif) - modern, readable
- **Letter Spacing:** 2-3px for luxury aesthetic
- **Font Weight:** 300-600 (light to semi-bold)

### Visual Effects
- Glassmorphic UI (backdrop blur, semi-transparent backgrounds)
- Smooth animations via Framer Motion
- Responsive design (clamp() for fluid typography)
- Mobile-first approach

---

## State Management & Data Flow

### Current Approach
- **Local State:** React hooks (useState for UI state)
- **Server State:** Supabase handles database state
- **No Redux/Context** - Simple data flow sufficient for current scope

### Data Flow Patterns
1. **Homepage:**
   - User selects category → `activeCategory` state updates
   - `useEffect` triggers → `fetchProducts()` called
   - Supabase query executes with category filter
   - Response sets `products` state
   - Components re-render with filtered products

2. **Admin:**
   - Login → Auth state verified
   - Dashboard renders product list
   - Form submission → Supabase INSERT/UPDATE
   - List re-fetches from database

---

## Environment Configuration

### Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
```

### Build & Deployment
- **Build Script:** `npm run build` - Compiles Next.js app
- **Dev Script:** `npm run dev` - Runs dev server on port 3000
- **Start Script:** `npm start` - Runs production server
- **Deployment:** Vercel (as indicated by deployment status)
- **Current Deployment:** URL shows `dpl_B1jW6RBq2tktPAHf43Mbdcqdu89W` (Vercel deployment ID)

---

## Language & Content

- **Primary Language:** French (specifically Moroccan French)
- **UI Text:** French labels and error messages
- **Content Examples:**
  - "Bijoux artisanaux marocains" (Moroccan artisanal jewelry)
  - "LILOOK" - Brand name (tagline: "Don't look back")
  - Categories in French (bagues, colliers, etc.)

---

## Development Workflow

### Scripts
```bash
npm run dev      # Development server with hot reload
npm run build    # Production build
npm start        # Production server
npm run lint     # Code quality checks
```

### Testing & Quality
- ESLint configured for code standards
- TypeScript for type safety
- No explicit test framework mentioned (testing to be added)

---

## Known Areas & Future Development

### Current Implementation Status
✅ **Complete:**
- Homepage with category filtering
- Product data model
- Admin login/authentication
- Navigation structure
- Branding & design system

⏳ **Partial/Pending:**
- Product detail page full implementation
- Shopping cart functionality
- Product search feature
- Admin product CRUD operations (form/list components exist but may need enhancement)
- Catalogue page detailed features
- Payment integration
- Order management system
- User reviews/ratings
- Wishlist functionality

### Possible Enhancements
- Image upload management (currently URLs only)
- Inventory tracking
- Email notifications
- Analytics dashboard
- SEO optimization
- PWA features
- Multi-language support
- Customer reviews & ratings
- Wishlist/favorites
- Payment gateway integration (Stripe, PayPal, etc.)

---

## Key Dependencies & Versions

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.4 | Full-stack framework |
| react | 19.2.4 | UI library |
| typescript | 5.9.3 | Type safety |
| tailwindcss | 4 | Styling |
| @supabase/supabase-js | 2.104.1 | Database client |
| framer-motion | 12.38.0 | Animations |
| embla-carousel-react | 8.6.0 | Image carousel |
| lucide-react | 1.11.0 | Icons |

---

## Code Style & Conventions

- **Component Pattern:** Functional components with hooks
- **Styling:** Mix of inline CSS and Tailwind (inline CSS more common in current codebase)
- **File Naming:** PascalCase for components, camelCase for utilities
- **Type Safety:** TypeScript enforced throughout
- **Client Directives:** `'use client'` used in interactive components
- **Routing:** Next.js App Router (file-based routing)

---

## Deployment & Hosting

- **Platform:** Vercel (Next.js creators' platform)
- **CI/CD:** Git-based deployment (push to main branch)
- **Last Git Operation:** Successful push to origin/main
- **Monitoring:** Vercel inspect available for debugging

---

## Summary for Continuation

This is a **modern, luxury e-commerce platform** built with cutting-edge technologies. The architecture is clean, scalable, and follows Next.js best practices. The design emphasizes elegance and luxury through:

1. **Sophisticated visual design** - Glassmorphic UI, luxury typography, warm color palette
2. **Type-safe codebase** - Full TypeScript implementation
3. **Scalable backend** - Supabase provides managed PostgreSQL with built-in auth
4. **Modern framework** - Latest Next.js 16 with React 19
5. **Mobile-first approach** - Responsive components and bottom navigation

The project is well-positioned for feature additions such as:
- Advanced product search & filtering
- Shopping cart & checkout
- Payment integration
- User accounts & order history
- Admin analytics & inventory management

The foundation is solid, and any AI continuing this work should focus on implementing the pending features while maintaining the established design patterns and TypeScript safety standards.
