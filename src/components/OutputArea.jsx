export default function OutputArea({ output, error, executionTime, isLoading }) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Output</h3>
        {executionTime !== null && !isLoading && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Execution time: {executionTime.toFixed(3)}s
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Executing code...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-600 dark:text-red-400 font-mono text-sm whitespace-pre-wrap">
            {error}
          </div>
        ) : output !== null && output !== undefined ? (
          <div className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre-wrap">
            {output}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-sm italic">
            Output will appear here after running your code...
          </div>
        )}
      </div>
    </div>
  );
}

