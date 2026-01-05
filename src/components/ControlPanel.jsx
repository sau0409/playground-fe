import { useState, useEffect, useCallback } from 'react';
import { getFiles, deleteFile } from '../services/api';

export default function ControlPanel({
  onRun,
  onSave,
  onLoad,
  onClear,
  onNewFile,
  onFileDeleted,
  isExecuting,
  language,
  onLanguageChange,
  currentFilename,
}) {
  const [saveFilename, setSaveFilename] = useState('my_script.py');
  
  // Update save filename when current filename changes
  useEffect(() => {
    if (currentFilename) {
      setSaveFilename(currentFilename);
    }
  }, [currentFilename]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fileError, setFileError] = useState(null);

  const fetchFiles = useCallback(async () => {
    setLoadingFiles(true);
    setFileError(null);
    try {
      const data = await getFiles();
      setFiles(data.files || []);
    } catch (err) {
      setFileError(err.message);
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  // Fetch files when dropdown is opened
  useEffect(() => {
    if (showLoadDropdown) {
      fetchFiles();
    }
  }, [showLoadDropdown, fetchFiles]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLoadDropdown && !event.target.closest('.load-dropdown-container')) {
        setShowLoadDropdown(false);
      }
    };

    if (showLoadDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showLoadDropdown]);

  const handleSave = () => {
    if (saveFilename.trim()) {
      onSave(saveFilename.trim());
      setShowSaveInput(false);
      setSaveFilename('my_script.py');
    }
  };

  const handleLoadFile = async (filename) => {
    setShowLoadDropdown(false);
    onLoad(filename);
    // Refresh file list after loading
    await fetchFiles();
  };

  const handleDeleteFile = async (filename, e) => {
    e.stopPropagation(); // Prevent loading the file when clicking delete
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await deleteFile(filename);
        // Refresh file list
        await fetchFiles();
        if (onFileDeleted) {
          onFileDeleted(filename);
        }
      } catch (err) {
        alert(`Error deleting file: ${err.message}`);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="python">Python</option>
          </select>
        </div>

        <div className="flex-1"></div>

        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={isExecuting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExecuting ? 'Running...' : 'Run'}
          <span className="ml-2 text-xs opacity-75">(Ctrl+Enter)</span>
        </button>

        {/* Save Button */}
        <div className="relative">
          <button
            onClick={() => setShowSaveInput(!showSaveInput)}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Save
          </button>
          {showSaveInput && (
            <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-3 z-10 min-w-[300px]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saveFilename}
                  onChange={(e) => setSaveFilename(e.target.value)}
                  placeholder="filename.py"
                  className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    } else if (e.key === 'Escape') {
                      setShowSaveInput(false);
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveInput(false)}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New File Button */}
        <button
          onClick={onNewFile}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          title="Create a new file"
        >
          New File
        </button>

        {/* Load Button */}
        <div className="relative load-dropdown-container">
          <button
            onClick={() => setShowLoadDropdown(!showLoadDropdown)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Load
          </button>
          {showLoadDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-20 min-w-[400px] max-w-[500px] max-h-[400px] overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Saved Files</h3>
                <button
                  onClick={() => setShowLoadDropdown(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none"
                  title="Close"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto bg-white dark:bg-gray-800">
                {loadingFiles ? (
                  <div className="px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading files...</p>
                  </div>
                ) : fileError ? (
                  <div className="px-4 py-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{fileError}</p>
                    <button
                      onClick={fetchFiles}
                      className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : files.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No saved files found</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {files.map((file) => (
                      <div
                        key={file.filename}
                        onClick={() => handleLoadFile(file.filename)}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {file.filename}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span className="truncate">{formatDate(file.modified)}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDeleteFile(file.filename, e)}
                            className="ml-2 px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete file"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

