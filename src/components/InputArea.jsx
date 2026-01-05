export default function InputArea({ input, onChange, show }) {
  if (!show) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Input (stdin)</h3>
      </div>
      <textarea
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter input data for your program..."
        className="w-full p-3 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0 min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        spellCheck="false"
      />
    </div>
  );
}

