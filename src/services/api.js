const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:5000/api';

/**
 * Execute Python code
 * @param {string} code - The Python code to execute
 * @param {string} language - The programming language (default: 'python')
 * @param {string|null} inputData - Optional stdin input
 * @returns {Promise<{output: string, error: string|null, execution_time: number}>}
 */
export async function executeCode(code, language = 'python', inputData = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        input_data: inputData || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Could not connect to the backend. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Save code to a file
 * @param {string} code - The code to save
 * @param {string} filename - The filename (e.g., 'my_script.py')
 * @returns {Promise<{message: string, filename: string}>}
 */
export async function saveCode(code, filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/save?code=${encodeURIComponent(code)}&filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Could not connect to the backend. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Load code from a file
 * @param {string} filename - The filename to load
 * @returns {Promise<{code: string, filename: string}>}
 */
export async function loadCode(filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/load/${encodeURIComponent(filename)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Could not connect to the backend. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Get list of all saved files
 * @returns {Promise<{files: Array<{filename: string, size: number, modified: string}>, count: number}>}
 */
export async function getFiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Could not connect to the backend. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Delete a saved file
 * @param {string} filename - The filename to delete
 * @returns {Promise<{message: string}>}
 */
export async function deleteFile(filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Could not connect to the backend. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Check backend health
 * @returns {Promise<{status: string}>}
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Could not connect to the backend.');
    }
    throw error;
  }
}

