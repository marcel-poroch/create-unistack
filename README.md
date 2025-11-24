# create-unistack

A modern, extensible CLI tool that helps you quickly scaffold full-stack projects without the hassle of manual configuration.

## Features

- **Multiple Templates**: React + Vite, Next.js, or Node.js + Express
- **Optional Styling**: Add TailwindCSS for beautiful, responsive designs
- **State Management**: Choose Zustand for React and Next.js projects
- **Zero Configuration**: Everything is set up and ready to use
- **Fast Setup**: Get started in seconds, not minutes

## Prerequisites

- **Node.js** version 18 or higher
- **npm** or **yarn** package manager

## Installation

### Option 1: Use without installation (Recommended)

You can use `create-unistack` directly without installing it globally:

```bash
npx create-unistack
```

Or specify the project name:

```bash
npx create-unistack my-awesome-app
```

### Option 2: Install globally

#### Windows

```powershell
npm install -g create-unistack
```

Then run:

```powershell
create-unistack
```

Or with a project name:

```powershell
create-unistack my-awesome-app
```

#### macOS / Linux

```bash
npm install -g create-unistack
```

Then run:

```bash
create-unistack
```

Or with a project name:

```bash
create-unistack my-awesome-app
```

## Usage

After running the command, you'll be guided through an interactive setup:

1. **Choose a template**:
   - React + Vite (TypeScript or JavaScript)
   - Next.js (TypeScript)
   - Node.js + Express

2. **For React and Next.js projects**:
   - Select a state manager (Zustand or None)
   - Choose a styling system (TailwindCSS or None)

3. **Install dependencies**:
   - Choose whether to run `npm install` automatically

4. **Start coding**:
   - Your project is ready! Navigate to the project directory and run `npm run dev`

## Available Templates

### React + Vite
- **TypeScript** or **JavaScript** versions
- Optional Zustand for state management
- Optional TailwindCSS for styling
- Hot module replacement (HMR) out of the box

### Next.js
- **TypeScript** only
- App Router architecture
- Optional Zustand for state management
- Optional TailwindCSS for styling
- Server and Client Components support

### Node.js + Express
- Clean project structure with `src/` directory
- Organized routes and services
- ES modules support
- Ready for API development

## Command Line Options

```bash
# Show version
create-unistack --version
# or
create-unistack -v

# Show help
create-unistack --help
# or
create-unistack -h
```

## Project Structure

### React + Vite
```
my-project/
├── src/
│   ├── components/     # (if Zustand is selected)
│   ├── store/          # (if Zustand is selected)
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

### Next.js
```
my-project/
├── app/
│   ├── components/     # (Counter component)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css     # (if TailwindCSS is selected)
├── lib/
│   └── store/          # (if Zustand is selected)
└── package.json
```

### Node.js + Express
```
my-project/
├── src/
│   ├── routes/
│   ├── services/
│   └── server.js
└── package.json
```

## Contributing

Found a bug or have a suggestion? We'd love to hear from you!

- [Report a bug](https://github.com/marcel-poroch/create-unistack/issues)
- [Request a feature](https://github.com/marcel-poroch/create-unistack/issues)
- [View the source code](https://github.com/marcel-poroch/create-unistack)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

---

**Happy coding!**
