# Express TypeScript Backend

A basic Express.js backend template with TypeScript.

## Features

- Express.js with TypeScript
- Basic API structure with routes, controllers, and middleware
- Error handling middleware
- Logging utility
- Organized project structure

## Project Structure

```
.
├── src/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.ts        # Entry point
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- pnpm

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
```

4. Start the production server:

```bash
pnpm start
```

## Development

The server will be available at http://localhost:3000 by default. The port can be configured via the `PORT` environment variable.

## License

ISC