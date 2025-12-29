# Monorepo App

A full-stack monorepo application built with modern web technologies, featuring a NestJS backend, Next.js web frontend, and React Native mobile app.

## 📁 Project Structure

This monorepo contains three main packages:

```
monorepo-app/
├── packages/
│   ├── backend/      # NestJS API server
│   ├── web/          # Next.js web application
│   └── mobile/       # React Native (Expo) mobile app
└── package.json      # Root workspace configuration
```

### Packages

- **Backend** (`packages/backend`): RESTful API built with NestJS
- **Web** (`packages/web`): Web application built with Next.js and React
- **Mobile** (`packages/mobile`): Mobile application built with React Native and Expo

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v8 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd monorepo-app
```

2. Install dependencies:
```bash
pnpm install
```

This will install all dependencies for all packages in the workspace.

## 🛠️ Development

### Running All Services

To start all services in development mode:

```bash
pnpm dev
```

### Running Individual Packages

#### Backend
```bash
pnpm --filter backend dev
```
The API will be available at `http://localhost:3000`

#### Web
```bash
pnpm --filter web dev
```
The web app will be available at `http://localhost:3001`

#### Mobile
```bash
pnpm --filter mobile start
```
Follow Expo CLI instructions to run on iOS/Android simulator or physical device.

## 📦 Package Management

This project uses pnpm workspaces. To add a dependency to a specific package:

```bash
# Add to backend
pnpm --filter backend add <package-name>

# Add to web
pnpm --filter web add <package-name>

# Add to mobile
pnpm --filter mobile add <package-name>

# Add to root (affects all packages)
pnpm add -w <package-name>
```

## 🧪 Testing

Run tests for all packages:
```bash
pnpm test
```

Run tests for a specific package:
```bash
pnpm --filter backend test
pnpm --filter web test
pnpm --filter mobile test
```

## 🏗️ Building

Build all packages:
```bash
pnpm build
```

Build a specific package:
```bash
pnpm --filter backend build
pnpm --filter web build
pnpm --filter mobile build
```

## 📝 Code Style

The project uses ESLint for code linting. Run the linter:

```bash
pnpm lint
```

Fix linting issues automatically:
```bash
pnpm lint:fix
```

## 🔧 Configuration

Each package has its own configuration files:

- **Backend**: `nest-cli.json`, `tsconfig.json`
- **Web**: `next.config.ts`, `tsconfig.json`
- **Mobile**: `app.json`, `tsconfig.json`

## 📱 Mobile Development

The mobile app uses Expo. For more details, see [packages/mobile/README.md](packages/mobile/README.md).

### Running on iOS
```bash
pnpm --filter mobile ios
```

### Running on Android
```bash
pnpm --filter mobile android
```

## 🌐 Web Development

The web app uses Next.js with App Router. For more details, see [packages/web/README.md](packages/web/README.md).

## 🔌 Backend Development

The backend uses NestJS framework. For more details, see [packages/backend/README.md](packages/backend/README.md).

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 👥 Authors

[Add authors/maintainers here]
