# PrepPath

**PrepPath** is a free exam-preparation workspace built to help students organize their syllabus, study sessions, progress, revision, and tests in one place.

## Current focus

The first supported exam is:

- **Bihar STET 2026**
- **Paper II**
- **Computer Science**
- **150 questions / 150 marks**
- **150 minutes**
- **No negative marking**

The product is being developed incrementally, with the exam catalog and syllabus serving as the foundation for future exam support such as STET, TRE, and other competitive examinations.

## Current product capabilities

- User signup and login
- Fresh browser-session authentication flow
- Exam setup and user exam selection
- Data-driven syllabus and topic navigation
- Topic progress tracking
- Confidence tracking
- Study sessions with saved history
- Live dashboard study metrics
- GitHub Pages deployment
- Supabase authentication and database integration

## Technology

- React
- TypeScript
- Vite
- Supabase
- GitHub Actions
- GitHub Pages
- Lucide React

## Repository structure

```text
prod/
├── static-app/              # GitHub Pages production app
│   ├── public/
│   └── src/
│       ├── app/             # Application routing
│       ├── components/      # Shared UI/layout components
│       ├── features/        # Feature-specific modules
│       ├── lib/             # Supabase and data access
│       └── types/           # Shared TypeScript models
├── supabase/                # Database migrations and exam data
└── .github/workflows/       # GitHub Pages deployment
```

## Architecture

PrepPath uses a static frontend with Supabase providing authentication and persistent application data:

```text
GitHub repository
       ↓
GitHub Actions
       ↓
GitHub Pages
       ↓
React / Vite application
       ↓
Supabase Auth + PostgreSQL
```

There is no Vercel dependency in the production deployment path.

## Local development

From the repository root:

```bash
cd static-app
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Supabase

Supabase is used for authentication and application persistence. Database migrations live under:

```text
supabase/migrations/
```

The frontend uses the Supabase publishable key; privileged server secrets must not be exposed in the client application.

## Deployment

The GitHub Actions workflow builds `static-app` and publishes its `dist` directory to GitHub Pages.

Expected production URL:

**https://adityak2608.github.io/prod/**

## Development principles

PrepPath is being built as a large production-style project. The codebase should remain modular and maintainable rather than putting all application logic into a single file.

Priority principles:

- Feature-based modular architecture
- Real data instead of demo metrics
- User-specific persistence
- Clear loading, empty, success, and error states
- Reusable UI components
- Incremental releases with a working production baseline
- Zero-cost infrastructure wherever practical

## Roadmap

### V2.1

- Complete feature modularization
- Harden routing and authentication
- Improve loading/error states
- Production-grade study timer
- Shared UI primitives
- Cleaner data/service layer

### V2.2

**Study Plan Engine**

Generate personalized daily study plans using:

- Exam date
- Syllabus structure
- Topic progress
- Confidence
- Study history
- Daily study target

### Future

- Revision engine
- Topic tests
- Unit tests
- Full-length mock tests
- Analytics
- Multiple exams
- Additional Bihar competitive examinations

## Cost

PrepPath is being designed to run with **zero mandatory software or hosting spend** during development and the initial free deployment phase.

## Status

🚧 **Active development**

PrepPath is currently focused on building the core preparation workflow for Bihar STET Computer Science before expanding to additional exams.
