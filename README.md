# 🎨 Universal Knowledge-Graph Builder - Frontend

> **Modern, responsive React frontend for transforming documents into interactive knowledge graphs with AI-powered Q&A and visual reasoning**

[![React](https://img.shields.io/badge/react-18+-blue)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/node-18+-green)](https://nodejs.org)
[![D3.js](https://img.shields.io/badge/D3.js-7+-orange)](https://d3js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-blue)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🎯 **Frontend Overview**

The Universal Knowledge-Graph Builder frontend is a **modern, responsive web application** that provides an intuitive interface for building, exploring, and querying knowledge graphs. Built with React 18, D3.js, and Tailwind CSS, it delivers:

- **Drag-and-drop file upload** with real-time processing feedback
- **Interactive knowledge graph visualization** with D3.js-powered layouts
- **AI-powered Q&A interface** with source citations and evidence trails
- **Responsive design** that works seamlessly on desktop and mobile
- **Real-time updates** with WebSocket-like responsiveness
- **Modern UI/UX** following Material Design principles

---

## 🏗️ **Architecture & Design**

### **Component Architecture**

```
App.jsx
├── Layout.jsx (Navigation & Structure)
├── Home.jsx (Landing Page)
├── Filehandler.jsx (File Management)
├── QAChatWindow.jsx (AI Chat Interface)
│   ├── MessageList.jsx (Chat Messages)
│   ├── Message.jsx (Individual Messages)
│   └── ChatInput.jsx (User Input)
├── KnowledgeGraphVisualizer.jsx (Graph Visualization)
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
- **React Router 6**: Client-side routing and navigation
- **React Hooks**: Functional component state management
- **JSX**: Declarative UI syntax

### **UI & Styling**
- **Tailwind CSS 3**: Utility-first CSS framework
- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability

### **Data Visualization**
- **D3.js 7**: Professional-grade data visualization library
- **Force-directed layouts**: Interactive graph positioning
- **SVG rendering**: Scalable vector graphics
- **Real-time updates**: Dynamic graph modifications

### **HTTP & API**
- **Fetch API**: Modern HTTP client
- **Axios**: Promise-based HTTP client (alternative)
- **RESTful integration**: Backend API communication
- **Error handling**: Graceful failure management

### **Build & Development**
- **Vite**: Fast build tool and dev server
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Hot Module Replacement**: Instant development updates

---

## 📁 **Project Structure**

```
frontend-p5/
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
│   │   ├── KnowledgeGraphVisualizer.jsx    # D3.js graph visualization
│   │   ├── KnowledgeGraphDemo.jsx          # Graph demo component
│   │   ├── Layout.jsx                      # Application layout
│   │   ├── Home.jsx                        # Landing page
│   │   ├── Manage.jsx                      # Management interface
│   │   └── Navbar.jsx                      # Navigation component
│   │
│   ├── styles/                 # CSS and styling
│   │   ├── app.css             # Application-specific styles
│   │   ├── home.css            # Home page styles
│   │   └── login.css           # Login page styles
│   │
│   ├── api.js                  # API integration functions
│   └── utils/                  # Utility functions
│
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
└── README.md                    # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- **Node.js 18+** (LTS version recommended)
- **npm 8+** or **yarn 1.22+**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Backend server** running on localhost:8000

### **Installation & Setup**

```bash
# 1. Clone the repository
git clone https://github.com/your-org/universal-kg-builder.git
cd universal-kg-builder/frontend-p5

# 2. Install dependencies
npm install
# or
yarn install

# 3. Set environment variables
cp .env.example .env
# Edit .env with your backend API URL

# 4. Start development server
npm start
# or
yarn start
```

### **Environment Variables**

```bash
# Backend API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000

# Google OAuth (if using Google login)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

# Application Settings
REACT_APP_ENV=development
REACT_APP_DEBUG=true
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
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check (if using TypeScript)
npm run type-check
```

---

## 🎨 **Key Components Deep Dive**

### **1. KnowledgeGraphVisualizer.jsx**

**Purpose**: Interactive D3.js-powered knowledge graph visualization

**Key Features**:
- **Force-directed layouts** for automatic node positioning
- **Interactive dragging** for manual node arrangement
- **Meaningful node labels** showing actual text content
- **Relationship visualization** with directed edges
- **Responsive design** adapting to container size

**Technical Implementation**:
```jsx
const KnowledgeGraphVisualizer = ({ graphData, width = 800, height = 600 }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    // D3.js force simulation setup
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.edges).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    // Node and edge rendering
    // Interactive features
    // Event handling
  }, [graphData]);

  return (
    <div className="w-full">
      {/* Graph controls and metadata */}
      <svg ref={svgRef} width="100%" height="600" />
    </div>
  );
};
```

**Performance Optimizations**:
- **useCallback** for stable function references
- **useMemo** for expensive calculations
- **Debounced updates** for smooth interactions
- **Efficient re-rendering** with React.memo

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
    setIsLoading(true);
    try {
      const response = await api.askQuestion(question, selectedFiles);
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.answer,
        sources: response.sources,
        traversalPath: response.traversal_path,
        showGraph: false
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
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
- **Bulk operations** for multiple files

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

  const uploadFiles = async (fileList) => {
    setUploading(true);
    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append('file', file);
        
        await api.uploadFile(formData);
        await fetchFiles(); // Refresh file list
      }
    } catch (error) {
      // Error handling
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      {/* File upload interface */}
    </div>
  );
};
```

---

## 🔌 **API Integration**

### **API Client Setup**

```javascript
// src/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token) {
    if (token) {
      this.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.headers.Authorization;
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Knowledge Graph Operations
  async uploadFile(formData) {
    return this.request('/knowledge-graph/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async uploadURL(url) {
    return this.request(`/knowledge-graph/url-upload?url=${encodeURIComponent(url)}`, {
      method: 'POST',
    });
  }

  async askQuestion(question, filenames = null) {
    const params = new URLSearchParams({ question });
    if (filenames && filenames.length > 0) {
      filenames.forEach(filename => params.append('filenames', filename));
    }

    return this.request(`/knowledge-graph/qa?${params.toString()}`, {
      method: 'POST',
    });
  }

  async getFiles() {
    return this.request('/knowledge-graph/files');
  }

  async deleteFile(filename) {
    return this.request(`/knowledge-graph/files/${filename}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
```

### **Error Handling**

```jsx
const useApiError = () => {
  const [error, setError] = useState(null);

  const handleApiError = (error) => {
    let userMessage = 'An unexpected error occurred';
    
    if (error.message.includes('HTTP error! status: 401')) {
      userMessage = 'Please log in to continue';
    } else if (error.message.includes('HTTP error! status: 403')) {
      userMessage = 'You do not have permission to perform this action';
    } else if (error.message.includes('HTTP error! status: 404')) {
      userMessage = 'The requested resource was not found';
    } else if (error.message.includes('HTTP error! status: 500')) {
      userMessage = 'Server error. Please try again later';
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
        accent: {
          50: '#fefce8',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
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

**Dark Mode Support**:
```jsx
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="
        p-2 rounded-lg
        bg-gray-100 dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors duration-200
      "
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
```

**Animation Classes**:
```jsx
const AnimatedComponent = () => (
  <div className="
    animate-fade-in
    hover:animate-pulse-slow
    transition-all duration-300 ease-in-out
    transform hover:scale-105
  ">
    {/* Animated content */}
  </div>
);
```

---

## 📱 **Responsive Design**

### **Mobile-First Approach**

**Breakpoint Strategy**:
- **Mobile**: 320px - 767px (default styles)
- **Tablet**: 768px - 1023px (sm: prefix)
- **Desktop**: 1024px - 1279px (lg: prefix)
- **Large Desktop**: 1280px+ (xl: prefix)

**Responsive Patterns**:
```jsx
const ResponsiveLayout = () => (
  <div className="
    // Mobile: Single column, full width
    w-full px-4 py-6
    
    // Tablet: Two columns, increased spacing
    sm:w-full sm:px-6 sm:py-8 sm:grid sm:grid-cols-2 sm:gap-6
    
    // Desktop: Three columns, maximum spacing
    lg:w-full lg:px-8 lg:py-12 lg:grid-cols-3 lg:gap-8
    
    // Large screens: Centered with max width
    xl:max-w-7xl xl:mx-auto
  ">
    {/* Responsive content */}
  </div>
);
```

### **Touch-Friendly Interface**

**Mobile Optimizations**:
- **Large touch targets** (minimum 44px)
- **Swipe gestures** for navigation
- **Touch-friendly buttons** and controls
- **Optimized scrolling** for mobile devices

**Touch Implementation**:
```jsx
const TouchFriendlyButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="
      min-h-[44px] min-w-[44px]
      px-4 py-3
      text-base font-medium
      rounded-lg
      bg-primary-600 text-white
      hover:bg-primary-700
      active:bg-primary-800
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      transition-colors duration-200
      touch-manipulation
    "
  >
    {children}
  </button>
);
```

---

## 🧪 **Testing Strategy**

### **Testing Framework Setup**

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **Component Testing Examples**

**KnowledgeGraphVisualizer Test**:
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
    expect(screen.getByText('Edges: 0')).toBeInTheDocument();
  });

  test('shows no data message when empty', () => {
    render(<KnowledgeGraphVisualizer graphData={null} />);
    
    expect(screen.getByText('No Graph Data')).toBeInTheDocument();
    expect(screen.getByText('Ask a question to see the knowledge graph visualization')).toBeInTheDocument();
  });
});
```

**API Integration Test**:
```jsx
// src/__tests__/api.test.js
import { api } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('uploadFile makes correct request', async () => {
    const mockResponse = { status: 'success' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const formData = new FormData();
    formData.append('file', new File(['test'], 'test.txt'));

    const result = await api.uploadFile(formData);
    
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/knowledge-graph/upload',
      expect.objectContaining({
        method: 'POST',
        body: formData,
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
```

---

## 🚀 **Build & Deployment**

### **Production Build**

```bash
# Create optimized production build
npm run build

# Build output structure
build/
├── static/
│   ├── css/          # Minified CSS bundles
│   ├── js/           # Minified JavaScript bundles
│   └── media/        # Optimized images and assets
├── index.html         # Main HTML file
└── asset-manifest.json # Asset mapping
```

### **Environment-Specific Builds**

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

### **Deployment Options**

**Static Hosting**:
```bash
# Netlify
netlify deploy --prod --dir=build

# Vercel
vercel --prod

# GitHub Pages
npm run deploy
```

**Docker Deployment**:
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📊 **Performance Optimization**

### **Bundle Optimization**

**Code Splitting**:
```jsx
// Lazy load components
const KnowledgeGraphVisualizer = lazy(() => import('./KnowledgeGraphVisualizer'));
const Filehandler = lazy(() => import('./filehandler/Filehandler'));

// Route-based code splitting
const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/graph" element={<KnowledgeGraphVisualizer />} />
      <Route path="/files" element={<Filehandler />} />
    </Routes>
  </Suspense>
);
```

**Tree Shaking**:
```javascript
// Import only what you need
import { useState, useEffect } from 'react';
import { debounce } from 'lodash-es'; // ES modules for tree shaking
```

### **Rendering Optimization**

**React.memo for Expensive Components**:
```jsx
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // Component logic
  return <div>{/* Rendered content */}</div>;
});

// Custom comparison function
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Return true if props are equal (no re-render needed)
  return prevProps.data.id === nextProps.data.id;
});
```

**useCallback for Stable References**:
```jsx
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Empty dependency array - function never changes

  return (
    <ChildComponent onClick={handleClick} />
  );
};
```

---

## 🔒 **Security Considerations**

### **Input Validation**

**Client-Side Validation**:
```jsx
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['text/plain', 'application/pdf', 'image/*'];

    if (file.size > maxSize) {
      setError('File size exceeds 100MB limit');
      return false;
    }

    if (!allowedTypes.some(type => file.type.match(type))) {
      setError('File type not supported');
      return false;
    }

    setError('');
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};
```

**XSS Prevention**:
```jsx
// Always sanitize user input
const SafeDisplay = ({ userInput }) => {
  // Don't do this - vulnerable to XSS
  // return <div dangerouslySetInnerHTML={{ __html: userInput }} />;

  // Do this - safe
  return <div>{userInput}</div>;
};
```

### **Authentication Security**

**Token Management**:
```jsx
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    api.setAuthToken(newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    api.setAuthToken(null);
  };

  // Auto-refresh token logic
  useEffect(() => {
    if (token) {
      const refreshInterval = setInterval(async () => {
        try {
          const response = await api.refreshToken();
          login(response.token);
        } catch (error) {
          logout();
        }
      }, 14 * 60 * 1000); // Refresh every 14 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [token]);

  return { token, login, logout };
};
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
npm run build -- --force

# Check Node.js version
node --version  # Should be 18+
```

**2. D3.js Rendering Issues**
```jsx
// Ensure container has dimensions
useEffect(() => {
  if (containerRef.current) {
    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width > 0 && height > 0) {
      // Initialize D3.js
    }
  }
}, []);
```

**3. API Connection Issues**
```jsx
// Check backend connectivity
const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`);
    if (response.ok) {
      console.log('Backend is healthy');
    }
  } catch (error) {
    console.error('Backend connection failed:', error);
  }
};
```

### **Debug Mode**

```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start

# Open browser dev tools
# Check Console tab for detailed logs
# Check Network tab for API calls
# Check React DevTools for component state
```

---

## 🤝 **Contributing**

### **Development Workflow**

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/your-username/universal-kg-builder.git

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Install dependencies
cd frontend-p5
npm install

# 5. Make changes and test
npm test
npm run lint
npm run build

# 6. Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature

# 7. Create pull request
```

### **Code Standards**

**JavaScript/React**:
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **React Hooks**: Use functional components with hooks
- **PropTypes**: Type checking for component props

**CSS/Styling**:
- **Tailwind CSS**: Utility-first approach
- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first methodology
- **Accessibility**: WCAG 2.1 AA compliance

**Commit Messages**:
```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add or update tests
refactor: code restructuring
style: formatting changes
perf: performance improvements
```

---

## 📚 **Additional Resources**

### **Documentation**
- **React Documentation**: [reactjs.org](https://reactjs.org)
- **D3.js Documentation**: [d3js.org](https://d3js.org)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **FastAPI Backend**: [localhost:8000/docs](http://localhost:8000/docs)

### **Examples & Templates**
- **Component Library**: `src/components/examples/`
- **API Integration**: `src/api/examples.js`
- **Styling Patterns**: `src/styles/patterns.css`
- **Test Templates**: `src/__tests__/templates/`

### **Community & Support**
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Wiki**: Additional documentation and guides
- **Discord**: Real-time community support

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **React Team** for the amazing UI framework
- **D3.js Community** for powerful visualization tools
- **Tailwind CSS** for utility-first styling
- **FastAPI Backend Team** for robust API support
- **Open Source Contributors** for continuous improvements

---

*Built with ❤️ by the Universal Knowledge-Graph Builder team*


