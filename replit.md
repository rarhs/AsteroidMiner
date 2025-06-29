# Space Mining Game

## Overview

This is a 3D space mining game built with React and Three.js, featuring a full-stack architecture with Express.js backend and PostgreSQL database. Players navigate a spaceship through asteroid fields, mining resources while avoiding collisions. The game includes immersive 3D graphics, particle effects, and audio feedback.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Rendering**: Three.js via @react-three/fiber and @react-three/drei
- **UI Components**: Radix UI with Tailwind CSS for styling
- **State Management**: Zustand for game state and audio management
- **Build Tool**: Vite with custom configuration for 3D assets

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Hot reload with Vite middleware integration
- **API Structure**: RESTful endpoints under `/api` prefix

### Project Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express application
├── shared/           # Shared TypeScript schemas and types
└── migrations/       # Database migration files
```

## Key Components

### Game Engine
- **SpaceShip**: Player-controlled 3D spaceship with physics-based movement
- **AsteroidField**: Procedurally generated asteroid field with collision detection
- **ParticleSystem**: Visual effects for explosions and resource collection
- **Environment**: 3D space environment with lighting and starfield

### Game State Management
- **useSpaceGame**: Core game state including ship position, asteroids, score, and health
- **useAudio**: Audio system for background music and sound effects
- **useGame**: Game phase management (ready, playing, ended)

### UI System
- **GameHUD**: In-game interface showing score, health, and resources
- **Interface**: Menu system and game controls
- **Comprehensive UI Library**: 30+ Radix UI components for consistent interface

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

## Data Flow

1. **Game Initialization**: 
   - Audio system loads sound files
   - 3D scene renders with spaceship and asteroid field
   - Game state initializes in "menu" phase

2. **Gameplay Loop**:
   - Keyboard input controls spaceship movement
   - Physics engine updates ship position and velocity
   - Collision detection between ship and asteroids
   - Particle effects trigger on resource collection/damage
   - HUD updates reflect current game state

3. **State Persistence**:
   - Game state managed in Zustand stores
   - Audio preferences persist across sessions
   - Database ready for user progress tracking

## External Dependencies

### 3D Graphics
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and components
- **@react-three/postprocessing**: Visual effects pipeline

### Database & Backend
- **@neondatabase/serverless**: PostgreSQL database driver
- **drizzle-orm**: Type-safe ORM with migration support
- **connect-pg-simple**: Session storage for Express

### UI & Styling
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

## Deployment Strategy

### Development
- **Hot Reload**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across frontend/backend
- **Database**: Local PostgreSQL with Drizzle migrations

### Production Build
- **Frontend**: Vite builds optimized React bundle
- **Backend**: esbuild compiles Node.js application
- **Assets**: Support for 3D models (.gltf, .glb) and audio files
- **Environment**: DATABASE_URL required for PostgreSQL connection

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Run production server
- `npm run db:push`: Apply database schema changes

## Changelog
- June 29, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.