# BrewTuner

**BrewTuner** is a web application designed to help coffee enthusiasts dial in the perfect grind settings for their coffee brewing. Track your grind profiles, log your results, and achieve consistent, delicious coffee every time.

## Features

- **Personalized Grind Profiles**: Create and save settings for each combination of coffee bean, grinder, and brewing method
- **Grind Logging System**: Track each grind attempt with detailed parameters:
  - Grinder setting (via interactive dial or numeric input)
  - Coffee weight in grams
  - Tamping status
  - Adjustment rating (coarser/good/finer)
  - Outcome notes and observations
  - Automatic timestamps
- **Profile Management**: Easily select from existing roasters, beans, grinders, and brewing methods, or create new ones on-the-fly
- **Log History**: View, edit, and delete historical grind logs to compare and optimize your results
- **Secure Authentication**: Multiple sign-in options including:
  - Email/password
  - Magic link (passwordless)
  - OAuth 2.0 (Google, GitHub)
  - WebAuthn/Security Keys
- **Dark Mode**: Automatic theme switching with system preference detection
- **Progressive Web App (PWA)**: Install as a standalone app with offline support

## Tech Stack

- **Frontend**: SvelteKit 2 with Svelte 5 (Rune-based reactivity)
- **Backend**: Nhost (Backend-as-a-Service with Hasura GraphQL)
- **Styling**: CSS Custom Properties with responsive design
- **Build Tool**: Vite 6
- **Deployment**: Vercel (with serverless adapter)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brewtuner.git
cd brewtuner
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

Copy the example environment file and configure your Nhost credentials:
```bash
cp .env.example .env
```

Then edit `.env` with your actual Nhost project details:
- Get your subdomain and region from your [Nhost Dashboard](https://app.nhost.io/)
- The subdomain is the first part of your Nhost URL (e.g., "myproject" from `myproject.nhost.run`)
- The region is shown in your project settings (e.g., "us-east-1", "eu-central-1")

```env
PUBLIC_NHOST_SUBDOMAIN=your-actual-subdomain
PUBLIC_NHOST_REGION=your-actual-region
```

4. Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Run Svelte type checking
- `pnpm check:watch` - Run type checking in watch mode
- `pnpm format` - Format code with Prettier
- `pnpm lint` - Lint code with ESLint

### Project Structure

```
src/
├── routes/
│   ├── +page.svelte          # Main application interface
│   ├── +layout.svelte        # Authentication wrapper and layout
│   ├── privacy/              # Privacy policy page
│   └── terms/                # Terms of service page
├── lib/
│   ├── graphQLClient.ts      # GraphQL queries, mutations, and types
│   ├── nhostClient.ts        # Nhost configuration
│   ├── themeStore.ts         # Theme management store
│   ├── Dial.svelte           # Interactive grinder setting dial
│   ├── LogDisplay.svelte     # Grind log viewer and editor
│   ├── Selector.svelte       # Reusable collapsible selector component
│   └── [Bean|Grinder|BrewMethod]Selector.svelte
└── app.css                   # Global styles and CSS variables
```

## Deployment

The application is configured for deployment on Vercel with the `@sveltejs/adapter-vercel` adapter.

To deploy:

```bash
pnpm build
```

Then deploy the `.vercel/output` directory or connect your repository to Vercel for automatic deployments.

## Database Schema

The application uses the following main entities:

- **Roasters**: Coffee roasting companies
- **Beans**: Specific coffee beans from roasters
- **Grinders**: Coffee grinding equipment
- **Brew Methods**: Brewing techniques (espresso, pour over, etc.)
- **Profiles**: Saved settings for bean + grinder + brew method combinations
- **Grind Logs**: Individual grind attempt records with all parameters

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Acknowledgments

Built with [SvelteKit](https://kit.svelte.dev/) and powered by [Nhost](https://nhost.io/)
