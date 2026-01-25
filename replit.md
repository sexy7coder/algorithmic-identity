# Explore Wrapped

## Overview

Explore Wrapped is a web application that analyzes Instagram feed screenshots to reveal a user's "algorithmic identity" - the persona that Instagram's algorithm has constructed based on their engagement patterns. Users upload screenshots of their Instagram explore page, and the app uses OpenAI's GPT-4o vision capabilities to generate insights about their digital persona, top themes, emotional landscape, blind spots, and what content they're avoiding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for smooth transitions
- **File Upload**: react-dropzone for drag-and-drop image uploads
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **File Handling**: Multer for multipart form data (image uploads)
- **AI Integration**: OpenAI GPT-4o for vision-based image analysis
- **API Pattern**: RESTful endpoints under `/api` prefix

### Data Flow
1. User uploads 1-10 Instagram feed screenshots
2. Images are sent as base64-encoded data to the backend
3. Backend sends images to OpenAI Vision API with a structured prompt
4. OpenAI returns JSON with persona analysis, themes, emotional insights, and blind spots
5. Frontend displays results in an Instagram Stories-like swipeable format

### Application States
The app follows a state machine pattern with these states:
- `IDLE`: Landing page with upload interface
- `ANALYZING`: Loading state with rotating messages
- `READY`: Analysis complete, showing summary
- `VIEWING`: Full results in a stories-style viewer
- `ERROR`: Error handling state

### Storage Architecture
- **Current**: In-memory storage (MemStorage class) for user data
- **Database Schema**: PostgreSQL schema defined with Drizzle ORM (users table with id, username, password)
- **Session**: Prepared for connect-pg-simple session storage

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for vision-based Instagram feed analysis
  - Requires `OPENAI_API_KEY` environment variable
  - Uses structured JSON output format

### Database
- **PostgreSQL**: Required for persistent storage
  - Requires `DATABASE_URL` environment variable
  - Schema managed via Drizzle ORM with `drizzle-kit push` command

### Key NPM Packages
- `openai`: Official OpenAI SDK for API calls
- `drizzle-orm` + `drizzle-zod`: Type-safe database ORM with Zod validation
- `multer`: Multipart form handling for file uploads
- `express-session` + `connect-pg-simple`: Session management
- `@tanstack/react-query`: Async state management
- `framer-motion`: Animation library
- `react-dropzone`: File upload handling

### Build & Development
- Vite for frontend bundling with HMR
- esbuild for server bundling (production builds)
- Custom Vite plugins for Replit integration (cartographer, dev-banner, meta-images)