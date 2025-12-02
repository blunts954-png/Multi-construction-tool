# Contributing to Construction SaaS

Thank you for your interest in contributing to Construction SaaS! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/construction-saas.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Setup

1. Install dependencies:
   ```bash
   cd construction-saas
   npm install
   ```

2. Copy `.env.example` to `.env` and configure your environment variables

3. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Making Changes

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

### Commit Messages

Follow conventional commits format:

- `feat: add new invoice upload feature`
- `fix: resolve QuickBooks auth issue`
- `docs: update README with deployment instructions`
- `refactor: improve AI service error handling`
- `test: add unit tests for RFI creation`

## Pull Request Process

1. Update documentation for any new features
2. Ensure your code follows the project's coding standards
3. Test your changes thoroughly
4. Update the README.md if needed
5. Submit a pull request with a clear description of your changes

### PR Title Format

- `[Feature] Add voice transcription for daily reports`
- `[Fix] Resolve invoice date parsing bug`
- `[Docs] Add Docker deployment guide`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have tested my changes
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable and function names

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use client components (`'use client'`) only when necessary

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Keep lines under 100 characters when possible
- Add comments for complex logic

### File Organization

```
construction-saas/
├── app/           # Next.js app directory
├── components/    # Reusable React components
├── lib/           # Utility functions and services
├── types/         # TypeScript type definitions
├── prisma/        # Database schema and migrations
└── public/        # Static assets
```

### Component Structure

```typescript
'use client' // Only if needed

import { useState } from 'react'
import type { Props } from '@/types'

// Component
export default function ComponentName({ prop1, prop2 }: Props) {
  // State
  const [state, setState] = useState()

  // Effects
  useEffect(() => {
    // ...
  }, [])

  // Handlers
  const handleClick = () => {
    // ...
  }

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## Database Changes

1. Create a new migration:
   ```bash
   npx prisma migrate dev --name description
   ```

2. Update the Prisma schema in `prisma/schema.prisma`
3. Generate Prisma Client: `npx prisma generate`
4. Update TypeScript types if needed

## Testing

- Test all user flows manually
- Test API endpoints with proper authentication
- Test edge cases and error scenarios
- Test on different screen sizes for UI changes

## Questions?

If you have questions, please:

1. Check existing issues and discussions
2. Open a new issue with the `question` label
3. Be clear and provide context

Thank you for contributing to Construction SaaS!
