# Explore Wrapped

## Overview

Explore Wrapped is a web application that analyzes Instagram feed screenshots using AI to reveal a user's "algorithmic identity" - what kind of person Instagram's algorithm perceives them to be. Users upload screenshots of their Instagram explore/feed, and the app uses OpenAI's vision capabilities to generate personalized insights about their digital persona, themes, emotional landscape, and blind spots.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Instagram-inspired dark theme
- **Animations**: Framer Motion for UI transitions and animations

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api` prefix
- **File Uploads**: Multer middleware for handling multipart form data (up to 10MB per image)
- **AI Integration**: OpenAI API for image analysis using GPT vision capabilities

### Data Flow
1. User uploads Instagram feed screenshots via drag-and-drop interface
2. Images are sent to `/api/analyze` endpoint as multipart form data
3. Server converts images to base64 and sends to OpenAI vision API
4. AI returns structured JSON with persona analysis
5. Frontend displays results in an animated card-based UI

### Build System
- Development: Vite dev server with HMR
- Production: Custom build script using esbuild for server bundling and Vite for client
- Server dependencies are selectively bundled to optimize cold start times

## External Dependencies

### AI Services
- **OpenAI API**: Used for image analysis with vision capabilities. Requires `OPENAI_API_KEY` environment variable.

### Database
- **PostgreSQL**: Configured via Drizzle ORM with schema in `shared/schema.ts`. Requires `DATABASE_URL` environment variable.
- **Drizzle Kit**: Used for database migrations (`db:push` script)
- **Current Schema**: Simple users table with id, username, and password fields

### Key npm Packages
- `openai`: Official OpenAI SDK for API integration
- `multer`: File upload handling middleware
- `drizzle-orm` / `drizzle-zod`: Database ORM with Zod schema validation
- `react-dropzone`: File drag-and-drop functionality
- `framer-motion`: Animation library for React

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal`: Runtime error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling (dev only)
- `@replit/vite-plugin-dev-banner`: Development banner (dev only)
- Custom `vite-plugin-meta-images`: Updates OpenGraph meta tags with Replit deployment URLs