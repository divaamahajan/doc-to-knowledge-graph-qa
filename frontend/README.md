# 🎨 Document to Knowledge Graph Q&A - Frontend

> **Modern, responsive React frontend for transforming documents into interactive knowledge graphs with AI-powered Q&A and visual reasoning**

[![React](https://img.shields.io/badge/react-18+-blue)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/node-16+-green)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-blue)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🎯 **Frontend Overview**

The Document to Knowledge Graph Q&A frontend is a **modern, responsive web application** that provides an intuitive interface for building, exploring, and querying knowledge graphs. Built with React 18 and Tailwind CSS, it delivers:

- **Drag-and-drop file upload** with real-time processing feedback
- **Interactive knowledge graph visualization** with dynamic layouts
- **AI-powered Q&A interface** with source citations and evidence trails
- **Responsive design** that works seamlessly on desktop and mobile
- **Real-time updates** with instant feedback
- **Modern UI/UX** following best practices

---

## 🏗️ **Architecture & Design**

### **Component Architecture**

```
App.jsx
├── Navbar.jsx (Navigation)
├── Home.jsx (Landing Page)
├── Filehandler.jsx (File Management)
├── QAChatWindow.jsx (AI Chat Interface)
│   ├── MessageList.jsx (Chat Messages)
│   ├── Message.jsx (Individual Messages)
│   └── ChatInput.jsx (User Input)
├── KnowledgeGraphVisualizer.jsx (Graph Visualization)
├── KnowledgeGraphDemo.jsx (Demo Component)
└── Authentication Components
    ├── LoginView.jsx
    ├── GoogleLoginButton.jsx
    └── ProfileView.jsx
```

### **State Management**

**Local Component State:**
- **useState**: Component-level state management
- **useEffect**: Side effects and lifecycle management
- **useRef**: DOM element references and persistent values
- **useCallback**: Memoized function definitions

**Global State:**
- **Context API**: Authentication and user session state
- **Local Storage**: Persistent user preferences
- **URL State**: Route-based state management

### **Data Flow**

```
User Action → Component State Update → API Call → 
Backend Processing → Response → UI Update → 
State Synchronization → Re-render
```

---

## 🛠️ **Technology Stack**

### **Core Framework**
- **React 18**: Modern component-based UI framework
- **Create React App**: Build toolchain and development setup
- **React Hooks**: Functional component state management
- **JSX**: Declarative UI syntax

### **UI & Styling**
- **Tailwind CSS 3**: Utility-first CSS framework
- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first approach
- **Modern CSS**: Flexbox and Grid layouts

### **HTTP & API**
- **Fetch API**: Modern HTTP client for backend communication
- **RESTful integration**: Backend API communication
- **Error handling**: Graceful failure management
- **File uploads**: Multipart form data handling

### **Build & Development**
- **Create React App**: React build system
- **Webpack**: Module bundling (via CRA)
- **Babel**: JavaScript transpilation (via CRA)
- **Hot Module Replacement**: Instant development updates

---

## 📁 **Project Structure**

```
frontend/
├── public/                      # Static assets
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # Site icon
│   ├── logo192.png             # App logo (192x192)
│   ├── logo512.png             # App logo (512x512)
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # Search engine directives
│
├── src/                        # Source code
│   ├── index.js                # Application entry point
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global application styles
│   ├── index.css               # Base CSS styles
│   ├── logo.svg                # Application logo
│   ├── reportWebVitals.js      # Performance monitoring
│   ├── setupTests.js           # Test configuration
│   │
│   ├── components/             # React components
│   │   ├── chatbot/            # Chat interface components
│   │   │   ├── ChatInput.jsx           # User input component
│   │   │   ├── ChatWindow.jsx          # Main chat interface
│   │   │   ├── Message.jsx             # Individual message display
│   │   │   └── MessageList.jsx         # Message list container
│   │   │
│   │   ├── filehandler/        # File management components
│   │   │   └── Filehandler.jsx         # File upload/download interface
│   │   │
│   │   ├── QAchatbot/          # Q&A interface components
│   │   │   ├── ChatInput.jsx           # Question input component
│   │   │   ├── Message.jsx             # Q&A message display
│   │   │   ├── MessageList.jsx         # Q&A message list
│   │   │   └── QAChatWindow.jsx        # Main Q&A interface
│   │   │
│   │   ├── login/              # Authentication components
│   │   │   ├── GoogleLoginButton.jsx   # Google OAuth button
│   │   │   ├── LoginView.jsx           # Login page
│   │   │   └── ProfileView.jsx         # User profile display
│   │   │
│   │   ├── KnowledgeGraphVisualizer.jsx    # Graph visualization
│   │   ├── KnowledgeGraphDemo.jsx          # Graph demo component
│   │   ├── Home.jsx                        # Landing page
│   │   └── Navbar.jsx                      # Navigation component
│   │
│   ├── styles/                 # CSS and styling
│   │   ├── app.css             # Application-specific styles
│   │   ├── home.css            # Home page styles
│   │   └── login.css           # Login page styles
│   │
│   └── __tests__/              # Test files
│       ├── EnhancedQAChat.test.jsx
│       ├── KnowledgeGraphVisualizer.test.jsx
│       └── URLIntegration.test.jsx
│
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- **Node.js 16+** (LTS version recommended)
- **npm 8+** or **yarn 1.22+**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Backend server** running on localhost:8000

### **Installation & Setup**

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd doc-to-knowledge-graph-qa/frontend

# 2. Install dependencies
npm install
# or
yarn install

# 3. Set environment variables (optional)
cp .env.example .env
# Edit .env with your backend API URL if different from default

# 4. Start development server
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

### **Environment Variables**

Create a `.env` file (optional) with the following variables:

```bash
# Backend API Configuration
BACKEND_API_URL=http://localhost:8000

# Google OAuth (if using Google login)
BACKEND_GOOGLE_CLIENT_ID=your_google_client_id

# Application Settings
BACKEND_ENV=development
```

### **Development Commands**

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Eject from Create React App (not recommended)
npm run eject
```

---

## 🎨 **Key Components Deep Dive**

### **1. KnowledgeGraphVisualizer.jsx**

**Purpose**: Interactive knowledge graph visualization

**Key Features**:
- **Dynamic layouts** for automatic node positioning
- **Interactive nodes** with click and hover events
- **Meaningful node labels** showing actual text content
- **Relationship visualization** with directed edges
- **Responsive design** adapting to container size

**Usage Example**:
```jsx
const App = () => {
  const [graphData, setGraphData] = useState(null);

  return (
    <KnowledgeGraphVisualizer 
      graphData={graphData} 
      width={800} 
      height={600} 
    />
  );
};
```

### **2. QAChatWindow.jsx**

**Purpose**: Main interface for AI-powered question answering

**Key Features**:
- **Real-time chat interface** with message history
- **Source citations** for every AI response
- **"Why?" button** revealing evidence trails
- **File context awareness** for targeted questions
- **Responsive design** for mobile and desktop

**State Management**:
```jsx
const QAChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const sendMessage = async (question, selectedFiles) => {
    // Handle message sending logic
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat interface */}
    </div>
  );
};
```

### **3. Filehandler.jsx**

**Purpose**: File upload, management, and organization

**Key Features**:
- **Drag-and-drop upload** with visual feedback
- **File type validation** and size checking
- **Progress indicators** for upload status
- **File organization** by type and date
- **URL upload** for web content

**Upload Implementation**:
```jsx
const Filehandler = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await uploadFiles(droppedFiles);
  };

  return (
    <div 
      className={`p-6 border-2 border-dashed ${
        dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
    >
      {/* File upload interface */}
    </div>
  );
};
```

---

## 🔌 **API Integration**

### **API Client Setup**

The frontend communicates with the backend using simple fetch requests:

```javascript
const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

// Upload file for processing
const uploadFile = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-graph/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Upload URL for processing
const uploadURL = async (url) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-graph/url-upload?url=${encodeURIComponent(url)}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`URL upload failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Ask question against knowledge graph
const askQuestion = async (question, filenames = null) => {
  const params = new URLSearchParams({ question });
  if (filenames && filenames.length > 0) {
    filenames.forEach(filename => params.append('filenames', filename));
  }

  const response = await fetch(`${API_BASE_URL}/knowledge-graph/qa?${params.toString()}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`Question failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Get list of uploaded files
const getFiles = async () => {
  const response = await fetch(`${API_BASE_URL}/knowledge-graph/files`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch files: ${response.statusText}`);
  }
  
  return response.json();
};

// Delete file and its knowledge graph
const deleteFile = async (filename) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-graph/files/${filename}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Delete failed: ${response.statusText}`);
  }
  
  return response.json();
};
```

### **Error Handling**

```jsx
const useApiError = () => {
  const [error, setError] = useState(null);

  const handleApiError = (error) => {
    let userMessage = 'An unexpected error occurred';
    
    if (error.message.includes('Upload failed')) {
      userMessage = 'Failed to upload file. Please try again.';
    } else if (error.message.includes('Question failed')) {
      userMessage = 'Failed to process question. Please try again.';
    } else if (error.message.includes('Failed to fetch files')) {
      userMessage = 'Failed to load files. Please refresh the page.';
    }

    setError(userMessage);
    
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  return { error, setError, handleApiError };
};
```

---

## 🎨 **Styling & Design System**

### **Tailwind CSS Configuration**

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          500: '#6b7280',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
};
```

### **Component Styling Patterns**

**Responsive Design**:
```jsx
const ResponsiveComponent = () => (
  <div className="
    w-full 
    px-4 sm:px-6 lg:px-8 
    py-6 sm:py-8 lg:py-12
    grid 
    grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
    gap-4 sm:gap-6 lg:gap-8
  ">
    {/* Content */}
  </div>
);
```

**Button Styles**:
```jsx
const Button = ({ children, onClick, variant = 'primary' }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};
```

---

## 📱 **Responsive Design**

### **Mobile-First Approach**

**Breakpoint Strategy**:
- **Mobile**: 320px - 767px (default styles)
- **Tablet**: 768px - 1023px (sm: prefix)
- **Desktop**: 1024px+ (lg: prefix)

**Responsive Patterns**:
```jsx
const ResponsiveLayout = () => (
  <div className="
    // Mobile: Single column, full width
    w-full px-4 py-6
    
    // Tablet: Two columns, increased spacing
    sm:px-6 sm:py-8 sm:grid sm:grid-cols-2 sm:gap-6
    
    // Desktop: Three columns, maximum spacing
    lg:px-8 lg:py-12 lg:grid-cols-3 lg:gap-8
  ">
    {/* Responsive content */}
  </div>
);
```

### **Touch-Friendly Interface**

**Mobile Optimizations**:
- **Large touch targets** (minimum 44px)
- **Touch-friendly buttons** and controls
- **Optimized scrolling** for mobile devices
- **Swipe gestures** where appropriate

---

## 🧪 **Testing Strategy**

### **Testing Framework Setup**

The project uses React Testing Library and Jest:

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode (default in development)
npm test

# Run tests once (for CI/CD)
npm test -- --watchAll=false
```

### **Test Examples**

**Component Testing**:
```jsx
// src/components/__tests__/KnowledgeGraphVisualizer.test.jsx
import { render, screen } from '@testing-library/react';
import KnowledgeGraphVisualizer from '../KnowledgeGraphVisualizer';

const mockGraphData = {
  nodes: [
    { id: '1', label: 'Test Node', type: 'chunk' }
  ],
  edges: [],
  metadata: { total_nodes: 1, total_edges: 0, files_involved: [] }
};

describe('KnowledgeGraphVisualizer', () => {
  test('renders graph visualization', () => {
    render(<KnowledgeGraphVisualizer graphData={mockGraphData} />);
    
    expect(screen.getByText('Knowledge Graph Visualization')).toBeInTheDocument();
    expect(screen.getByText('Nodes: 1')).toBeInTheDocument();
  });

  test('shows no data message when empty', () => {
    render(<KnowledgeGraphVisualizer graphData={null} />);
    
    expect(screen.getByText('No Graph Data')).toBeInTheDocument();
  });
});
```

---

## 🚀 **Build & Deployment**

### **Production Build**

```bash
# Create optimized production build
npm run build

# Build output in build/ directory
build/
├── static/
│   ├── css/          # Minified CSS bundles
│   ├── js/           # Minified JavaScript bundles
│   └── media/        # Optimized images and assets
├── index.html         # Main HTML file
└── asset-manifest.json # Asset mapping
```

### **Deployment Options**

**Static Hosting**:
```bash
# Netlify
# 1. Build the project: npm run build
# 2. Drag and drop the build/ folder to Netlify

# Vercel
# 1. Connect your GitHub repository
# 2. Vercel will auto-deploy on push

# GitHub Pages
# 1. Install gh-pages: npm install --save-dev gh-pages
# 2. Add to package.json: "homepage": "https://username.github.io/repository"
# 3. Add deploy script: "deploy": "gh-pages -d build"
# 4. Run: npm run deploy
```

**Docker Deployment**:
```dockerfile
# Dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📊 **Performance Optimization**

### **Bundle Optimization**

**Code Splitting with React.lazy**:
```jsx
import { lazy, Suspense } from 'react';

// Lazy load components
const KnowledgeGraphVisualizer = lazy(() => import('./KnowledgeGraphVisualizer'));
const Filehandler = lazy(() => import('./filehandler/Filehandler'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/graph" element={<KnowledgeGraphVisualizer />} />
      <Route path="/files" element={<Filehandler />} />
    </Routes>
  </Suspense>
);
```

### **Rendering Optimization**

**React.memo for Expensive Components**:
```jsx
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // Component logic
  return <div>{/* Rendered content */}</div>;
});
```

**useCallback for Stable References**:
```jsx
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Empty dependency array - function never changes

  return <ChildComponent onClick={handleClick} />;
};
```

---

## 🔒 **Security Considerations**

### **Input Validation**

**Client-Side Validation**:
```jsx
const FileUpload = () => {
  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['text/plain', 'application/pdf', 'image/png', 'image/jpeg'];

    if (file.size > maxSize) {
      return 'File size exceeds 100MB limit';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported';
    }

    return null; // Valid file
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const error = validateFile(selectedFile);
    
    if (error) {
      alert(error);
      return;
    }

    // Process valid file
  };

  return <input type="file" onChange={handleFileChange} />;
};
```

**XSS Prevention**:
```jsx
// Safe - React automatically escapes content
const SafeDisplay = ({ userInput }) => (
  <div>{userInput}</div>
);

// Dangerous - avoid using dangerouslySetInnerHTML with user input
const UnsafeDisplay = ({ userInput }) => (
  <div dangerouslySetInnerHTML={{ __html: userInput }} />
);
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

**1. Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
npm run build
```

**2. API Connection Issues**
```bash
# Check if backend is running
curl http://localhost:8000/ping

# Verify environment variables
echo $BACKEND_API_URL
```

**3. Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

### **Debug Mode**

```bash
# Start with debug logging
BACKEND_DEBUG=true npm start

# Open browser dev tools:
# - Console tab for JavaScript errors
# - Network tab for API calls
# - React DevTools for component state
```

---

## 🤝 **Contributing**

### **Development Workflow**

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/doc-to-knowledge-graph-qa.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Install dependencies
cd frontend
npm install

# 4. Make changes and test
npm test
npm run build

# 5. Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

### **Code Standards**

**JavaScript/React**:
- **ES6+**: Modern JavaScript features
- **Functional Components**: Use hooks over class components
- **PropTypes**: Type checking for component props (optional)
- **ESLint**: Code quality (configured via Create React App)

**CSS/Styling**:
- **Tailwind CSS**: Utility-first approach
- **Responsive Design**: Mobile-first methodology
- **Accessibility**: WCAG guidelines compliance

---

## 📚 **Additional Resources**

### **Documentation**
- **React Documentation**: [reactjs.org](https://reactjs.org)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Create React App**: [create-react-app.dev](https://create-react-app.dev)
- **Backend API**: [localhost:8000/docs](http://localhost:8000/docs)

### **Community & Support**
- **GitHub Issues**: Bug reports and feature requests
- **React Community**: [reactjs.org/community](https://reactjs.org/community)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **React Team** for the amazing UI framework
- **Tailwind CSS** for utility-first styling
- **Create React App** for the excellent build toolchain
- **Backend Team** for robust API support

---

*Built with ❤️ using React and modern web technologies*