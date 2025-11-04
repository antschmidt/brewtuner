# Contributing to BrewTuner

Thank you for considering contributing to BrewTuner! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Component Guidelines](#component-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm (recommended) or npm/yarn
- Git
- A code editor (VS Code recommended with Svelte extensions)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/brewtuner.git
   cd brewtuner
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Create a `.env` file with Nhost credentials (contact maintainers for development keys)

5. Start the dev server:
   ```bash
   pnpm dev
   ```

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style guidelines

3. Test your changes locally

4. Run linting and formatting:
   ```bash
   pnpm format
   pnpm lint
   pnpm check
   ```

5. Commit your changes with a descriptive commit message

6. Push to your fork and create a pull request

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Prefer `interface` over `type` for object types
- Use explicit types for function parameters and return values
- Avoid `any` - use `unknown` if type is truly unknown

### Svelte

- Use Svelte 5 runes syntax (`$state`, `$derived`, `$props`, `$effect`)
- Keep components focused and single-purpose
- Use `$bindable()` for two-way binding props
- Prefer composition over large monolithic components

### Formatting

- Use Prettier for code formatting (configured in `.prettierrc`)
- Use ESLint for linting (configured in `eslint.config.js`)
- Run `pnpm format` before committing
- 2-space indentation for consistency

### File Organization

```
src/
├── routes/           # SvelteKit routes (pages)
├── lib/              # Reusable components and utilities
│   ├── *.svelte     # Reusable Svelte components
│   └── *.ts         # Utility functions and stores
└── app.css          # Global styles
```

## Component Guidelines

### Creating New Components

1. Add a file header comment explaining the component's purpose
2. Document props using JSDoc-style comments
3. Keep styles scoped to the component when possible
4. Use CSS custom properties for theming (defined in `app.css`)

Example:

```svelte
<script lang="ts">
/**
 * MyComponent
 *
 * Brief description of what this component does.
 *
 * Features:
 * - Feature 1
 * - Feature 2
 */

  // Props
  let { value = $bindable(), label } = $props();

  // State
  let internalState = $state(0);
</script>

<div class="my-component">
  <label>{label}</label>
  <input bind:value />
</div>

<style>
  .my-component {
    /* Component styles */
  }
</style>
```

### GraphQL Functions

When adding new GraphQL operations:

1. Add types/interfaces to `src/lib/graphQLClient.ts`
2. Document with JSDoc comments
3. Include `@param`, `@returns`, and `@throws` tags
4. Group related operations together with section comments

## Commit Message Guidelines

Follow the conventional commits specification:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(logs): add ability to edit grind log entries

Added inline editing functionality to LogDisplay component
with save and cancel buttons.

Closes #123
```

```
fix(dial): correct angle calculation for negative values

The dial was not properly handling negative angle values,
causing incorrect grinder settings.
```

## Pull Request Process

1. **Update Documentation**: Update README or other docs if needed

2. **Run Tests**: Ensure all checks pass:
   ```bash
   pnpm check
   pnpm lint
   pnpm format
   ```

3. **Describe Your Changes**:
   - Clear title summarizing the change
   - Description of what changed and why
   - Screenshots for UI changes
   - Reference related issues

4. **Keep PRs Focused**:
   - One feature/fix per PR
   - Avoid mixing refactoring with feature work
   - Break large changes into smaller PRs

5. **Respond to Feedback**: Address review comments promptly

## Testing

### Manual Testing Checklist

Before submitting a PR, manually test:

- [ ] Feature works in both light and dark themes
- [ ] Responsive design works on mobile and desktop
- [ ] No console errors or warnings
- [ ] Data persists correctly (localStorage and database)
- [ ] Authentication flows work correctly
- [ ] Existing features still work (regression testing)

### Type Checking

```bash
pnpm check
```

This runs Svelte's type checker to catch TypeScript errors.

## Database Schema Changes

If you need to modify the database schema:

1. **Discuss First**: Open an issue to discuss the schema change
2. **Document Changes**: Update the database schema section in README.md
3. **Migration Plan**: Provide a migration plan for existing data
4. **Test Thoroughly**: Test with production-like data

## Questions or Issues?

- Open an issue for bugs or feature requests
- Reach out to maintainers for questions about architecture or design decisions
- Check existing issues and PRs to avoid duplicates

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions

Thank you for contributing to BrewTuner! ☕
