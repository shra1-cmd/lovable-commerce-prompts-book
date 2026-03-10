# Garuda Dhhruvam NGO Website - Complete Codebase Overview

## 📋 Project Summary

This is a **modern, full-stack NGO website** for Garuda Dhhruvam Foundation, built with React, TypeScript, and Vite. The website features:
- **Public-facing website** with dynamic content management
- **Donation system** integrated with Razorpay payment gateway
- **Admin dashboard** for content and data management
- **Supabase backend** for database and authentication
- **Netlify deployment** with edge functions support

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1 (with SWC for fast compilation)
- **Styling**: Tailwind CSS 3.4.11 + shadcn/ui components (Radix UI primitives)
- **State Management**: React Query (TanStack Query) for server state, React Hook Form for forms
- **Routing**: React Router DOM 6.26.2
- **Backend**: Supabase (PostgreSQL database + Authentication + Edge Functions)
- **Payment Gateway**: Razorpay integration
- **Deployment**: Netlify (static site hosting)
- **Form Validation**: Zod 3.23.8
- **UI Components**: 40+ shadcn/ui components based on Radix UI

### Project Structure
```
garuda/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # External service integrations
│   ├── config/         # Configuration files
│   ├── lib/            # Utility functions
│   └── assets/         # Images and media
├── Configuration files  # Build, TypeScript, Tailwind configs
└── Documentation       # Setup and deployment guides
```

---

## 📁 Detailed File Structure & Purpose

### Root Configuration Files

#### `package.json`
**Purpose**: Defines project metadata, dependencies, and npm scripts.

**Key Information**:
- **Project Name**: `garuda-ngo-website`
- **Homepage**: `https://garuda2.netlify.app`
- **Scripts**:
  - `npm run dev` - Start development server on port 8080
  - `npm run build` - Production build
  - `npm run build:dev` - Development build
  - `npm run build:prod` - Production build with optimizations
  - `npm run lint` - Run ESLint
  - `npm run preview` - Preview production build

**Dependencies**:
- **Core**: React, React DOM, React Router DOM
- **UI Framework**: 40+ Radix UI components, Tailwind CSS, shadcn/ui
- **Backend**: Supabase JS client
- **State**: React Query, React Hook Form
- **Payment**: Razorpay (via edge functions)
- **Utilities**: Zod, date-fns, lucide-react icons, sonner (toast notifications)

#### `vite.config.ts`
**Purpose**: Vite build configuration with optimizations.

**Key Features**:
- **Port**: 8080 (development)
- **Path Alias**: `@/` maps to `./src/`
- **Plugins**: React SWC plugin for fast compilation, lovable-tagger (dev only)
- **Build Optimizations**:
  - Code splitting: vendor, supabase, ui chunks
  - Minification: Terser with console removal
  - Source maps: Disabled for production
  - Output: `dist/` directory

#### `tsconfig.json`
**Purpose**: TypeScript compiler configuration.

**Key Settings**:
- **Path Mapping**: `@/*` → `./src/*`
- **Strict Mode**: Disabled (flexible typing)
- **Module Resolution**: Node
- **Target**: ES2020+

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration with custom theme.

**Key Features**:
- **Custom Colors**: 
  - `sandalwood`, `clay-red`, `indigo`, `turmeric`, `ivory` (NGO brand colors)
  - Standard shadcn/ui color system (primary, secondary, muted, etc.)
- **Dark Mode**: Class-based
- **Animations**: Accordion animations
- **Container**: Centered with responsive padding

#### `netlify.toml`
**Purpose**: Netlify deployment configuration.

**Configuration**:
- **Build Command**: `npm install --include=dev && npm run build:prod`
- **Publish Directory**: `dist`
- **Node Version**: 18
- **Redirects**: SPA routing (all routes → `/index.html`)

#### `env.example`
**Purpose**: Template for environment variables.

**Variables**:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_RAZORPAY_TEST_KEY` - Razorpay test key
- `VITE_RAZORPAY_LIVE_KEY` - Razorpay live key

---

### Source Code Structure (`src/`)

#### `src/main.tsx`
**Purpose**: Application entry point.

**Functionality**:
- Renders React app to DOM root
- Suppresses Razorpay Canvas warnings in development
- Imports global CSS

#### `src/App.tsx`
**Purpose**: Root component with routing and providers.

**Structure**:
- **Providers**:
  - `QueryClientProvider` - React Query for server state
  - `TooltipProvider` - Global tooltip context
  - `Toaster` & `Sonner` - Toast notifications
- **Routes**:
  - `/` - Homepage (Index)
  - `/donate` - Donation page
  - `/volunteer` - Volunteer registration
  - `/participant` - Participant registration
  - `/stories` - Stories listing
  - `/story/:id` - Story detail page
  - `/test-payment` - Payment testing page
  - `/admin/login` - Admin authentication
  - `/admin/*` - Admin dashboard (protected)
  - `*` - 404 Not Found

#### `src/index.css`
**Purpose**: Global CSS with Tailwind directives and CSS variables.

**Contains**:
- Tailwind base, components, utilities
- CSS custom properties for theming (colors, radius, etc.)
- Global styles

---

### Pages (`src/pages/`)

#### `Index.tsx`
**Purpose**: Homepage component.

**Structure**:
- Uses `useWebsiteContent` hook to fetch dynamic content
- Renders sections:
  - `Header` - Navigation
  - `HeroSection` - Hero banner with stats
  - `OurStorySection` - Organization story
  - `MissionVisionSection` - Mission and vision
  - `AreaOfWorkSection` - Work areas
  - `TrustSection` - Trust indicators
  - `ShowcaseSection` - Featured content
  - `CTASection` - Call-to-action
  - `Footer` - Site footer

#### `AdminDashboard.tsx`
**Purpose**: Protected admin dashboard.

**Features**:
- **Authentication**: Checks Supabase session, redirects if not authenticated
- **Layout**: Header + Sidebar + Content area
- **Tabs**:
  - `dashboard` - Statistics overview
  - `programs` - Program management
  - `stories` - Story management
  - `gallery` - Gallery management
  - `events` - Event management
  - `donations` - Donation tracking
  - `volunteers` - Volunteer management
  - `participants` - Participant management
  - `content` - Website content editor
  - `subscribers` - Newsletter subscribers

#### `AdminLogin.tsx`
**Purpose**: Admin authentication page.

**Functionality**:
- Supabase email/password authentication
- Session management
- Redirect to dashboard on success

#### `DonatePage.tsx`
**Purpose**: Donation page with payment form.

**Features**:
- Donation form (amount, donor info, purpose)
- Razorpay payment integration
- Payment verification via edge functions

#### `VolunteerPage.tsx`
**Purpose**: Volunteer registration page.

**Features**:
- Volunteer application form
- Skills, interests, availability fields
- Submission to Supabase

#### `ParticipantPage.tsx`
**Purpose**: Program participant registration.

**Features**:
- Participant registration form
- Event/program selection
- Data submission

#### `StoriesPage.tsx`
**Purpose**: Stories listing page.

**Features**:
- Fetches stories from Supabase
- Displays story cards with images
- Links to detail pages

#### `StoryDetailPage.tsx`
**Purpose**: Individual story detail page.

**Features**:
- Fetches story by ID
- Displays full content, author, date
- Related stories section

#### `TestPayment.tsx`
**Purpose**: Payment testing page.

**Features**:
- Test Razorpay integration
- Debug payment flow

#### `NotFound.tsx`
**Purpose**: 404 error page.

---

### Components (`src/components/`)

#### Public Components

##### `Header.tsx`
**Purpose**: Main navigation header.

**Features**:
- Logo/branding
- Navigation menu
- Mobile responsive
- Links to key pages

##### `Footer.tsx`
**Purpose**: Site footer.

**Features**:
- Contact information
- Social media links
- Newsletter subscription
- Quick links

##### `HeroSection.tsx`
**Purpose**: Hero banner section.

**Features**:
- Dynamic title/subtitle from database
- Call-to-action buttons
- Statistics display
- Background image

##### `OurStorySection.tsx`
**Purpose**: Organization story section.

**Features**:
- Founder's story
- Organization history
- Image gallery

##### `MissionVisionSection.tsx`
**Purpose**: Mission and vision display.

**Features**:
- Dynamic content from `website_mission` table
- Mission, vision, philosophy text

##### `AreaOfWorkSection.tsx`
**Purpose**: Work areas showcase.

**Features**:
- Program categories
- Impact metrics
- Visual cards

##### `TrustSection.tsx`
**Purpose**: Trust indicators.

**Features**:
- Certifications
- Transparency metrics
- Partner logos

##### `ShowcaseSection.tsx`
**Purpose**: Featured content showcase.

**Features**:
- Featured stories
- Recent programs
- Gallery highlights

##### `CTASection.tsx`
**Purpose**: Call-to-action section.

**Features**:
- Dynamic CTA text from database
- Donation/volunteer buttons
- Background image

##### `DonationForm.tsx` & `DonationFormNew.tsx`
**Purpose**: Donation form components.

**Features**:
- Form validation (Zod)
- Razorpay integration
- Payment processing
- Receipt generation

##### `JoinMovementModal.tsx`
**Purpose**: Modal for joining movement.

**Features**:
- Newsletter signup
- Volunteer interest
- Contact form

##### `GarudaEmblem.tsx`
**Purpose**: Brand emblem/logo component.

---

#### Admin Components (`src/components/admin/`)

##### `AdminHeader.tsx`
**Purpose**: Admin dashboard header.

**Features**:
- User info display
- Logout button
- Notifications

##### `AdminSidebar.tsx`
**Purpose**: Admin navigation sidebar.

**Features**:
- Tab navigation
- Active state highlighting
- Icon-based menu

##### `DashboardStats.tsx`
**Purpose**: Dashboard statistics overview.

**Features**:
- Total donations
- Active programs
- Volunteers count
- Recent activity
- Charts/graphs (Recharts)

##### `ProgramsManager.tsx`
**Purpose**: Program CRUD operations.

**Features**:
- List programs
- Create/edit/delete programs
- Program details form
- Status management

##### `StoriesManager.tsx`
**Purpose**: Story content management.

**Features**:
- Story listing
- Create/edit/delete stories
- Rich text editor
- Image upload
- Publishing workflow

##### `GalleryManager.tsx`
**Purpose**: Gallery image management.

**Features**:
- Image upload (Supabase Storage)
- Category management
- Featured image selection
- Image metadata

##### `EventsManager.tsx`
**Purpose**: Event management.

**Features**:
- Event CRUD
- Registration management
- Participant tracking
- Event status

##### `DonationsManager.tsx`
**Purpose**: Donation tracking and management.

**Features**:
- Donation listing
- Filter/search
- Status updates
- Receipt management
- Export functionality

##### `VolunteersManager.tsx`
**Purpose**: Volunteer management.

**Features**:
- Volunteer listing
- Application review
- Status management
- Contact information

##### `ParticipantsManager.tsx`
**Purpose**: Program participant management.

**Features**:
- Participant listing
- Registration management
- Event assignment

##### `ContentManager.tsx`
**Purpose**: Website content editor.

**Features**:
- Edit hero section
- Edit mission/vision
- Edit stats
- Edit contact info
- Real-time preview

##### `SubscribersManager.tsx`
**Purpose**: Newsletter subscriber management.

**Features**:
- Subscriber list
- Export emails
- Unsubscribe management

##### `FileUpload.tsx`
**Purpose**: File upload component.

**Features**:
- Supabase Storage integration
- Image preview
- Progress tracking
- Error handling

---

### Hooks (`src/hooks/`)

#### `useWebsiteContent.ts`
**Purpose**: Fetch and update website content.

**Functionality**:
- Fetches content from Supabase tables:
  - `hero` → `website_hero`
  - `stats` → `website_stats`
  - `mission` → `website_mission`
  - `contact` → `website_contact`
  - `cta` → `website_hero`
- `updateContent()` - Updates content (requires auth)
- Returns: `{ content, loading, error, updateContent, refetch }`

#### `useWebsiteHero.ts`
**Purpose**: Hero section content hook.

**Functionality**:
- Fetches hero content
- Returns title, subtitle, CTAs

#### `useWebsiteStats.ts`
**Purpose**: Statistics content hook.

**Functionality**:
- Fetches stats (villages, temples, programs, women skilled)

#### `useWebsiteMission.ts`
**Purpose**: Mission/vision content hook.

**Functionality**:
- Fetches mission, vision, philosophy

#### `useWebsiteContact.ts`
**Purpose**: Contact information hook.

**Functionality**:
- Fetches contact details (email, phone, address)

#### `use-mobile.tsx`
**Purpose**: Mobile device detection hook.

**Functionality**:
- Detects mobile screen size
- Returns boolean

#### `use-toast.ts`
**Purpose**: Toast notification hook.

**Functionality**:
- Shows success/error/info toasts
- Uses shadcn/ui toast system

---

### Integrations (`src/integrations/`)

#### `supabase/client.ts`
**Purpose**: Supabase client initialization.

**Configuration**:
- **URL**: From `VITE_SUPABASE_URL` env var
- **Key**: From `VITE_SUPABASE_ANON_KEY` env var
- **Auth**: localStorage persistence, auto-refresh tokens
- **Type Safety**: Uses generated `Database` types

#### `supabase/types.ts`
**Purpose**: Auto-generated TypeScript types from Supabase schema.

**Database Tables**:
1. **donations** - Donation records
   - Fields: amount, donor info, payment status, transaction ID, etc.
2. **events** - Event records
   - Fields: title, date, location, participants, registration fee, etc.
3. **gallery** - Gallery images
   - Fields: image_url, category, title, description, is_featured, etc.
4. **programs** - Program records
   - Fields: title, category, description, budget, beneficiaries, status, etc.
5. **stories** - Story/blog posts
   - Fields: title, content, author, category, featured_image, status, etc.
6. **volunteers** - Volunteer records
   - Fields: name, email, phone, skills, interests, status, etc.
7. **website_contact** - Contact information
   - Fields: email, phone, address, office_hours
8. **website_hero** - Hero section content
   - Fields: title, subtitle, cta_primary, cta_secondary
9. **website_mission** - Mission/vision content
   - Fields: mission_text, vision, philosophy
10. **website_stats** - Statistics
    - Fields: villages, temples_revived, programs_active, women_skilled
11. **subscribers** - Newsletter subscribers
    - Fields: email, subscribed_at, is_active

**Type Utilities**:
- `Tables<T>` - Get table row type
- `TablesInsert<T>` - Get insert type
- `TablesUpdate<T>` - Get update type

---

### Configuration (`src/config/`)

#### `payment.ts`
**Purpose**: Payment configuration and types.

**Configuration**:
- Razorpay keys (test/live)
- Edge function URLs:
  - `CREATE_ORDER_URL` - Create payment order
  - `VERIFY_PAYMENT_URL` - Verify payment signature
- NGO details (name, description)
- Theme color (turmeric: #FBC02D)
- Currency: INR

**Types**:
- `PaymentOptions` - Razorpay payment options
- `PaymentResponse` - Payment response
- `DonationData` - Donation form data
- `CreateOrderRequest/Response` - Order creation
- `VerifyPaymentRequest/Response` - Payment verification

#### `razorpay.ts`
**Purpose**: Razorpay-specific configuration (legacy/alternative).

**Similar to `payment.ts` but with different structure.**

---

### Utilities (`src/lib/`)

#### `utils.ts`
**Purpose**: Utility functions.

**Functions**:
- `cn(...inputs)` - Combines class names using `clsx` and `tailwind-merge`
  - Used for conditional Tailwind classes

---

### Assets (`src/assets/`)

**Image Files**:
- `hero-bg.jpg` - Hero section background
- `cta-bg.jpg` - CTA section background
- `founder-portrait.jpg` - Founder image
- `founder-portrait-2.jpg` - Alternative founder image

---

### Public Assets (`public/`)

#### `_redirects`
**Purpose**: Netlify redirects configuration.

**Configuration**:
- All routes (`/*`) redirect to `/index.html` (SPA routing)
- Status: 200 (rewrite, not redirect)

#### `favicon.ico`
**Purpose**: Site favicon.

#### `logo-emblem.png`
**Purpose**: Organization logo/emblem.

#### `robots.txt`
**Purpose**: Search engine crawler instructions.

#### `placeholder.svg`
**Purpose**: Placeholder image.

---

### Documentation Files

#### `README.md`
**Purpose**: Project overview and quick start guide.

**Contents**:
- Quick start instructions
- Netlify deployment guide
- Tech stack overview
- Environment variables
- Available scripts

#### `DEPLOYMENT.md`
**Purpose**: Detailed deployment guide.

**Contents**:
- Step-by-step Netlify deployment
- Environment variable setup
- Supabase configuration
- Razorpay setup
- Troubleshooting

#### `PAYMENT_SETUP.md`
**Purpose**: Payment integration guide.

**Contents**:
- Razorpay account setup
- Edge function configuration
- Payment flow explanation
- Testing procedures

#### `EMAIL_SETUP.md`
**Purpose**: Email configuration guide.

**Contents**:
- Email service setup (Resend)
- Receipt email templates
- Configuration steps

#### `setup-razorpay-env.md`
**Purpose**: Razorpay environment setup.

**Contents**:
- Key generation
- Environment variable configuration
- Testing

#### `ROUTING_TEST.md`
**Purpose**: Routing configuration testing.

**Contents**:
- SPA routing verification
- Redirect rules
- Testing procedures

#### `VERIFICATION_CHECKLIST.md`
**Purpose**: Pre-deployment verification checklist.

**Contents**:
- Feature checklist
- Configuration verification
- Testing procedures

---

### Test Files

#### `test-edge-function.html`
**Purpose**: Standalone HTML file for testing Supabase edge functions.

**Features**:
- Tests `create-order` edge function
- Manual testing interface
- Response display

---

### Build Artifacts

#### `dist/`
**Purpose**: Production build output (generated, not in repo).

**Contents**:
- Optimized HTML, CSS, JS
- Asset files
- Source maps (if enabled)

#### `node_modules/`
**Purpose**: NPM dependencies (not in repo).

#### `bun.lockb` & `package-lock.json`
**Purpose**: Dependency lock files.

---

## 🔄 Data Flow

### Public Website Flow
1. **User visits** → `Index.tsx` renders
2. **Content fetching** → `useWebsiteContent` hooks fetch from Supabase
3. **Sections render** → Components display dynamic content
4. **User interaction** → Forms submit to Supabase or trigger payments

### Donation Flow
1. **User fills form** → `DonatePage.tsx`
2. **Form validation** → Zod schema validation
3. **Create order** → Call Supabase edge function `create-order`
4. **Razorpay payment** → Open Razorpay checkout
5. **Payment success** → Call `verify-payment` edge function
6. **Save donation** → Insert into `donations` table
7. **Send receipt** → Email via Resend (if configured)

### Admin Flow
1. **Login** → `AdminLogin.tsx` → Supabase Auth
2. **Session check** → `AdminDashboard.tsx` verifies session
3. **Content management** → CRUD operations on Supabase tables
4. **File uploads** → Supabase Storage
5. **Logout** → Clear session

---

## 🔐 Authentication & Authorization

### Public Access
- All public pages accessible without authentication
- Donation, volunteer, participant forms are public

### Admin Access
- **Route**: `/admin/*`
- **Authentication**: Supabase Auth (email/password)
- **Session**: Stored in localStorage
- **Protection**: `AdminDashboard.tsx` checks session on mount
- **Redirect**: Unauthenticated users → `/admin/login`

---

## 💳 Payment Integration

### Razorpay Integration
1. **Frontend**: Razorpay checkout script loaded
2. **Order Creation**: Supabase edge function `create-order`
   - Generates Razorpay order
   - Returns order ID
3. **Payment**: Razorpay checkout modal
4. **Verification**: Supabase edge function `verify-payment`
   - Verifies signature
   - Saves donation record
   - Sends receipt email

### Edge Functions (Supabase)
- **Location**: Not in this repo (deployed separately)
- **Functions**:
  - `create-order` - Create Razorpay order
  - `verify-payment` - Verify payment and save donation

---

## 🎨 Styling System

### Tailwind CSS
- **Utility-first** CSS framework
- **Custom theme** with NGO brand colors
- **Responsive** design (mobile-first)
- **Dark mode** support (class-based)

### shadcn/ui Components
- **40+ components** built on Radix UI
- **Accessible** (ARIA compliant)
- **Customizable** via Tailwind classes
- **Type-safe** with TypeScript

### Custom Colors
- `sandalwood` - Brand color
- `clay-red` - Accent color
- `indigo` - Secondary color
- `turmeric` - Primary accent (#FBC02D)
- `ivory` - Background color

---

## 🗄️ Database Schema (Supabase)

### Key Tables

#### `donations`
- Tracks all donations
- Links to Razorpay transactions
- Stores donor information
- Payment status tracking

#### `programs`
- NGO programs/projects
- Budget tracking
- Beneficiary counts
- Status management

#### `stories`
- Blog posts/success stories
- Rich content
- Author information
- Publishing workflow

#### `events`
- Upcoming/past events
- Registration management
- Participant tracking

#### `volunteers`
- Volunteer applications
- Skills and interests
- Status tracking

#### `website_*` tables
- Dynamic website content
- Editable via admin panel
- Single-row tables (singleton pattern)

---

## 🚀 Deployment

### Netlify Deployment
1. **Build**: `npm run build:prod`
2. **Output**: `dist/` directory
3. **Environment Variables**: Set in Netlify dashboard
4. **Redirects**: Configured in `netlify.toml` and `_redirects`
5. **Auto-deploy**: On git push to main branch

### Environment Setup
- **Supabase**: Project URL and keys
- **Razorpay**: Test/live keys
- **Node Version**: 18

---

## 🔧 Development Workflow

### Local Development
1. **Install**: `npm install`
2. **Environment**: Copy `env.example` to `.env`
3. **Start**: `npm run dev` (port 8080)
4. **Build**: `npm run build`
5. **Preview**: `npm run preview`

### Code Organization
- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Hooks**: Custom React hooks
- **Config**: Configuration files
- **Utils**: Helper functions

---

## 📊 Key Features

### Public Features
- ✅ Dynamic homepage with editable content
- ✅ Donation system with Razorpay
- ✅ Volunteer registration
- ✅ Participant registration
- ✅ Stories/blog section
- ✅ Gallery showcase
- ✅ Newsletter subscription
- ✅ Responsive design

### Admin Features
- ✅ Content management (hero, mission, stats, contact)
- ✅ Program management
- ✅ Story management
- ✅ Gallery management
- ✅ Event management
- ✅ Donation tracking
- ✅ Volunteer management
- ✅ Participant management
- ✅ Subscriber management
- ✅ Dashboard statistics

---

## 🔍 Important Notes for GPT

### Code Patterns
- **Path Aliases**: Use `@/` instead of relative paths
- **Type Safety**: Full TypeScript with Supabase-generated types
- **Component Structure**: Functional components with hooks
- **State Management**: React Query for server state, local state for UI
- **Form Handling**: React Hook Form + Zod validation

### Common Imports
```typescript
import { supabase } from '@/integrations/supabase/client'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
```

### Database Access
- Always use typed Supabase client
- Use hooks for data fetching
- Handle loading and error states
- Check authentication for mutations

### Styling
- Use Tailwind utility classes
- Use `cn()` for conditional classes
- Follow shadcn/ui component patterns
- Maintain brand colors

### Payment Flow
- Always create order via edge function first
- Verify payment signature server-side
- Save donation record after verification
- Handle errors gracefully

---

## 🎯 Summary

This is a **production-ready NGO website** with:
- **Modern tech stack** (React, TypeScript, Vite)
- **Full-stack functionality** (Supabase backend)
- **Payment integration** (Razorpay)
- **Admin dashboard** (content management)
- **Dynamic content** (database-driven)
- **Responsive design** (mobile-first)
- **Type-safe** (TypeScript throughout)
- **Deployed** (Netlify hosting)

The codebase is well-organized, follows React best practices, and uses modern tooling for optimal developer experience and performance.

