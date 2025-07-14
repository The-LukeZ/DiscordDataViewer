# Discord Data Viewer

A modern web application for viewing and exporting your Discord user data and guild information.

## Features

- 🔐 **Secure OAuth2 Authentication** - Login with your Discord account
- 👤 **User Profile Viewer** - View detailed user information including avatar, locale, and primary guild
- 🏰 **Guild Data Explorer** - Browse all your Discord servers with detailed information
- 📋 **Data Export** - Copy guild data to clipboard in JSON format with customizable field selection
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Built with DaisyUI and TailwindCSS

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended package manager)
- Discord application

### Installation

1. Clone the repository:

```bash
git clone https://github.com/The-LukeZ/discordDataViever.git
cd discordDataViever
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure your Discord OAuth2 credentials in `.env`

4. Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:5173` to view the application.

## Usage

1. **Login** - Authenticate with your Discord account
2. **Fetch User Data** - Load your Discord profile information
3. **Fetch Guilds** - Load all your Discord servers
4. **Export Data** - Select specific fields and copy guild data as JSON

## Technology Stack

- **Frontend**: SvelteKit 5, TypeScript
- **Styling**: TailwindCSS 4, DaisyUI
- **API**: Discord API v10
- **Runtime**: Node.js
- **Package Manager**: pnpm

## Development

```bash
# Development server
pnpm dev

# Type checking
pnpm check

# Format code
pnpm format

# Build for production
pnpm build
```

## License

This project is private and not licensed for public use.
