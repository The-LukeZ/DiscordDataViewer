# Discord Data Viewer

A modern web application for viewing and exporting your Discord user data and guild information.

## Features

- 🔐 **Secure OAuth2 Authentication** - Login with your Discord account
- 👤 **User Profile Viewer** - View detailed user information including avatar, locale, and primary guild
- 🏰 **Guild Data Explorer** - Browse all your Discord servers with detailed information
- 📋 **Data Export** - Copy guild data to clipboard in JSON format with customizable field selection
- 🔒 **Encrypted Storage** - All user data is encrypted before storage using KV workers, ensuring privacy
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Built with DaisyUI and TailwindCSS

## Privacy & Security

This application prioritizes your data privacy:

- **End-to-end encryption**: All Discord data is encrypted client-side before being stored
- **Zero-knowledge storage**: Data is stored encrypted in KV workers - even the developer cannot read your stored data (well, I could manually decrypt it, but I won't)
- **Temporary credentials**: Credentials are stored for only one day, after which they are automatically deleted, and the cookie expires
- **Secure authentication**: Uses Discord's OAuth2 for secure login
- **No data retention**: You control your data and can delete it at any time

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended package manager)
- Discord application
- Cloudflare Workers account (for KV storage)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/The-LukeZ/DiscordDataViever.git ddv
cd ddv
```

2. Install dependencies:

```bash
pnpm i
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure your Discord OAuth2 credentials and Cloudflare KV credentials in `.env`

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
5. **Data Management** - Your data is automatically encrypted and stored securely

## Technology Stack

- **Frontend**: SvelteKit 5, TypeScript
- **Styling**: TailwindCSS 4, DaisyUI
- **API**: Discord API v10
- **Storage**: Cloudflare KV Workers with client-side encryption
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
