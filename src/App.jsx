import { useState, useEffect, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputArea from './components/OutputArea';
import InputArea from './components/InputArea';
import ControlPanel from './components/ControlPanel';
import Timer from './components/Timer';
import { executeCode, saveCode, loadCode, checkHealth } from './services/api';

function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [language, setLanguage] = useState('python');
  const [showInput, setShowInput] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [currentFilename, setCurrentFilename] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to light mode
    return false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRun = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to execute.');
      setOutput(null);
      setExecutionTime(null);
      return;
    }

    setIsExecuting(true);
    setError(null);
    setOutput(null);
    setExecutionTime(null);
    setApiError(null);

    try {
      const result = await executeCode(code, language, input || null);
      
      if (result.error) {
        setError(result.error);
        setOutput(null);
      } else {
        setOutput(result.output || '');
        setError(null);
      }
      
      setExecutionTime(result.execution_time || null);
    } catch (err) {
      setApiError(err.message);
      setError(err.message);
      setOutput(null);
      setExecutionTime(null);
    } finally {
      setIsExecuting(false);
    }
  }, [code, input, language]);

  // Check backend health on mount
  useEffect(() => {
    checkHealth().catch((err) => {
      setApiError(`Backend connection error: ${err.message}`);
    });
  }, []);

  // Keyboard shortcut for Run (Ctrl+Enter or Cmd+Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isExecuting) {
          handleRun();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExecuting, handleRun]);

  const handleSave = async (filename) => {
    if (!code.trim()) {
      alert('No code to save.');
      return;
    }

    try {
      setApiError(null);
      const result = await saveCode(code, filename);
      setCurrentFilename(result.filename);
      alert(`File saved successfully: ${result.filename}`);
    } catch (err) {
      setApiError(err.message);
      alert(`Error saving file: ${err.message}`);
    }
  };

  const handleLoad = async (filename) => {
    try {
      setApiError(null);
      const result = await loadCode(filename);
      setCode(result.code || '');
      setCurrentFilename(result.filename);
      setOutput(null);
      setError(null);
      setExecutionTime(null);
      alert(`File loaded successfully: ${result.filename}`);
    } catch (err) {
      setApiError(err.message);
      alert(`Error loading file: ${err.message}`);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the editor?')) {
      setCode('');
      setInput('');
      setOutput(null);
      setError(null);
      setExecutionTime(null);
      setCurrentFilename(null);
    }
  };

  const handleNewFile = () => {
    if (code.trim() && !window.confirm('Create a new file? Unsaved changes will be lost.')) {
      return;
    }
    setCode('');
    setInput('');
    setOutput(null);
    setError(null);
    setExecutionTime(null);
    setCurrentFilename(null);
  };

  const handleFileDeleted = (filename) => {
    // Clear current filename if the deleted file was the current one
    if (currentFilename === filename) {
      setCurrentFilename(null);
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Python Playground</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Write and execute Python code</p>
            </div>
            <div className="flex items-center gap-3">
              {currentFilename && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Current File:</span>
                  <span className="text-sm font-mono font-semibold text-blue-800 dark:text-blue-300">{currentFilename}</span>
                </div>
              )}
              <Timer />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <span className="text-xl">☀️</span>
                ) : (
                  <span className="text-xl">🌙</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden max-w-7xl w-full mx-auto px-4 py-4">
        {/* API Error Banner */}
        {apiError && (
          <div className="flex-shrink-0 mb-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-300">{apiError}</p>
          </div>
        )}

        {/* Control Panel */}
        <div className="flex-shrink-0 mb-2">
          <ControlPanel
            onRun={handleRun}
            onSave={handleSave}
            onLoad={handleLoad}
            onClear={handleClear}
            onNewFile={handleNewFile}
            onFileDeleted={handleFileDeleted}
            isExecuting={isExecuting}
            language={language}
            onLanguageChange={setLanguage}
            currentFilename={currentFilename}
          />
        </div>

        {/* Input Toggle */}
        <div className="flex-shrink-0 mb-2">
          <button
            onClick={() => setShowInput(!showInput)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            {showInput ? 'Hide' : 'Show'} Input (stdin)
          </button>
        </div>

        {/* Input Area */}
        {showInput && (
          <div className="flex-shrink-0 mb-2">
            <InputArea input={input} onChange={setInput} show={showInput} />
          </div>
        )}

        {/* Editor and Output Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
          {/* Code Editor */}
          <div className="min-h-0 overflow-hidden">
            <CodeEditor code={code} onChange={setCode} />
          </div>

          {/* Output Area */}
          <div className="min-h-0 overflow-hidden">
            <OutputArea
              output={output}
              error={error}
              executionTime={executionTime}
              isLoading={isExecuting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

