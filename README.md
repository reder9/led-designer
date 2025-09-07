# LED Panel Designer

A modern, interactive LED panel designer built with React and Vite. Create custom LED displays with text, icons, and dynamic effects.

## 🚀 Features

- **Interactive LED Panel Design**: Drag, resize, and position text and icon elements
- **Dynamic Effects**: Rainbow, breathing, chase, and pulse effects
- **Icon Library**: Comprehensive collection of social media, gaming, and sports icons
- **Export Functionality**: Export your designs as high-quality images
- **Real-time Preview**: See your design update in real-time
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **Interactions**: react-rnd for drag & drop
- **Export**: html-to-image for image generation
- **Code Quality**: ESLint, Prettier, Husky

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd canva-lite

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting

# Build & Deploy
npm run build           # Build for production
npm run pre-deploy      # Run all checks before deploy
```

## 🚀 AWS Amplify Deployment

### Prerequisites

1. AWS Account with Amplify access
2. Node.js 18+ installed
3. Git repository (GitHub, GitLab, etc.)

### Option 1: Amplify Console (Recommended)

1. **Connect Repository**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository

2. **Configure Build Settings**:
   - Amplify will auto-detect the `amplify.yml` file
   - Verify build settings match your requirements
   - Environment: `Node.js 18+`

3. **Environment Variables** (if needed):
   - Add any required environment variables
   - `NODE_ENV=production` (auto-set)

4. **Deploy**:
   - Click "Save and deploy"
   - Amplify will build and deploy automatically

### Option 2: Amplify CLI

```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify (one-time setup)
amplify configure

# Initialize Amplify in your project
amplify init

# Add hosting
amplify add hosting

# Publish your app
amplify publish
```

### Build Configuration

The `amplify.yml` file is pre-configured with:

- **Pre-build**: Install dependencies with `npm ci`
- **Build**: Run linting, formatting checks, and build
- **Artifacts**: Serve files from `dist/` directory
- **Cache**: Cache `node_modules` for faster builds

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ElementRenderer.jsx    # Renders text/icon elements
│   ├── Panel.jsx             # Main LED panel
│   ├── SidebarLeft.jsx       # Left control panel
│   ├── SidebarRight.jsx      # Right control panel
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useClipboard.jsx      # Clipboard functionality
│   ├── useHistory.jsx        # Undo/redo system
│   └── ...
├── utils/               # Utility functions
│   ├── colors.js            # Color utilities
│   ├── iconMap.jsx          # Dynamic icon imports
│   └── ...
└── assets/              # Static assets
    └── icons/               # SVG icon library
```

## 🎨 Features Guide

### LED Effects

- **Static**: Solid color glow
- **Rainbow**: Cycling through spectrum
- **Breathing**: Pulsing intensity
- **Chase**: Moving light pattern
- **Pulse**: Quick flash effect

### Icons

- **Social Media**: Instagram, TikTok, Twitter, Facebook, YouTube, Twitch
- **Gaming**: Various gaming-related icons
- **Sports**: Sports and activity icons
- Automatically imported from `src/assets/icons/` folders

### Export Options

- **PNG**: High-quality image export
- **Clipboard**: Direct copy to clipboard
- **Download**: Save file locally

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```env
VITE_APP_TITLE="LED Panel Designer"
VITE_DEBUG_MODE=false
```

### Customization

- **Colors**: Modify `src/utils/colors.js`
- **Icons**: Add SVG files to `src/assets/icons/[category]/`
- **Effects**: Extend effects in `src/components/ElementRenderer.jsx`

## 🚦 Code Quality

This project uses:

- **ESLint**: Code linting with React best practices
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **lint-staged**: Stage-specific linting

Pre-commit hooks automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Ensure code quality before commits

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run quality checks: `npm run pre-deploy`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Build Fails on Amplify**:

- Check Node.js version (18+ required)
- Verify all dependencies are in `package.json`
- Check build logs in Amplify console

**Icons Not Loading**:

- Ensure SVG files are in correct folder structure
- Check file names don't contain special characters
- Verify import paths in `iconMap.jsx`

**Slow Build Times**:

- Enable Amplify build caching
- Consider removing unused dependencies
- Optimize image assets

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons from various open-source icon libraries
- React and Vite communities
- AWS Amplify team

---

**Live Demo**: [Your Amplify URL here after deployment]+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
