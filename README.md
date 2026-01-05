# Python Playground Frontend

A modern, minimalist web-based Python playground for practicing coding interviews and testing solutions. This frontend application provides a clean, distraction-free code editor with real-time execution capabilities.

## Features

- **Simple Code Editor**: Clean textarea-based editor with line numbers and tab indentation support
- **Real-time Code Execution**: Execute Python code and see results instantly
- **File Management**: Save and load code files
- **Input Support**: Provide stdin input for interactive programs
- **Modern UI**: Responsive design with Tailwind CSS
- **Keyboard Shortcuts**: Run code with `Ctrl+Enter` (or `Cmd+Enter` on Mac)
- **Error Handling**: Clear error messages for network and execution errors
- **Loading States**: Visual feedback during code execution

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend repository for setup)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playground-fe
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set the API base URL:
```
VITE_API_BASE_URL=http://localhost/api
```

Or if running backend directly (not via docker-compose):
```
VITE_API_BASE_URL=http://localhost:8000
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

The built files will be in the `dist` directory.

## API Integration

The frontend integrates with the following backend endpoints:

### Execute Code
- **POST** `/api/execute`
- Executes Python code and returns output/error

### Save Code
- **POST** `/api/save?code={code}&filename={filename}`
- Saves code to a file

### Load Code
- **GET** `/api/load/{filename}`
- Loads code from a saved file

### Health Check
- **GET** `/api/health`
- Checks backend connectivity

## Usage

1. **Write Code**: Type your Python code in the editor
2. **Run Code**: Click the "Run" button or press `Ctrl+Enter` (or `Cmd+Enter`)
3. **View Output**: Results appear in the output area on the right
4. **Provide Input**: Click "Show Input (stdin)" to provide input data
5. **Save Code**: Click "Save" and enter a filename (e.g., `my_script.py`)
6. **Load Code**: Click "Load" and enter the filename to load

## Project Structure

```
playground-fe/
├── src/
│   ├── components/
│   │   ├── CodeEditor.jsx      # Code editor component
│   │   ├── OutputArea.jsx      # Output display component
│   │   ├── InputArea.jsx       # Stdin input component
│   │   └── ControlPanel.jsx    # Control buttons component
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # This file
```

## Technology Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Fetch API**: HTTP client for API calls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend Connection Error
- Ensure the backend is running
- Check the `VITE_API_BASE_URL` in `.env` matches your backend URL
- Verify CORS is configured on the backend

### Code Execution Timeout
- The backend has a 10-second execution limit
- Optimize your code or break it into smaller parts

### File Save/Load Issues
- Ensure filenames include the `.py` extension
- Check backend file permissions

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
