// app/components/JarvisComponent.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface JarvisComponentProps {
  newTask: string;
  onSuggestionSelect: (suggestion: string) => void;
}

export default function JarvisComponent({ newTask, onSuggestionSelect }: JarvisComponentProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("Chưa xác định");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm gọi API với debounce
  const fetchSuggestions = async (task: string) => {
    setIsLoading(true);

    try {
      // Gọi API GPT-4.0 để lấy gợi ý và phân loại
      const response = await fetch('/api/groq/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task })
      });

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setCategory(data.category || "Chưa xác định"); // Cập nhật phân loại từ API
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setCategory("Chưa xác định");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

  useEffect(() => {
    if (newTask.trim()) {
      debouncedFetchSuggestions(newTask);
    } else {
      setSuggestions([]);
    }
  }, [newTask, debouncedFetchSuggestions]);

  const handleSelectSuggestion = (suggestion: string) => {
    // Loại bỏ số thứ tự trước khi gọi hàm onSuggestionSelect
    const cleanedSuggestion = suggestion.replace(/^[0-9]+\.\s*/, ""); // Loại bỏ ký tự số thứ tự và dấu chấm
    onSuggestionSelect(cleanedSuggestion);
  };

  return (
    <div className="jarvis-container">
      <h2>Nampd Sen - Gợi ý Nhiệm vụ</h2>
      <div className="suggestions">
        {isLoading ? (
           <div className="loading">
            <FontAwesomeIcon icon={faSpinner} spin /> {/* Icon loading */}
            <p>Đang tải gợi ý...</p>
         </div>
        ) : (
          suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <p>Không có gợi ý nào</p>
          )
        )}
      </div>
      <div className="category">
        <p>Phân loại: <strong>{category}</strong></p>
      </div>
    </div>
  );
}
