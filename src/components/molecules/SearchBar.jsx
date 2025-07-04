import { useState, useEffect, useRef } from 'react';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { cakeService } from '@/services/api/cakeService';

const SearchBar = ({ onSearch, placeholder = "Search cakes...", className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setShowSuggestions(false);
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(value);
    }
    
    // Clear previous timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }
    
    // Debounce suggestion fetching
    if (value.trim().length > 0) {
      setIsLoading(true);
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestionData = await cakeService.getSuggestions(value);
          setSuggestions(suggestionData);
          setShowSuggestions(true);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selectedSuggestion = suggestions[selectedIndex];
          setSearchTerm(selectedSuggestion.name);
          if (onSearch) {
            onSearch(selectedSuggestion.name);
          }
          setShowSuggestions(false);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    if (onSearch) {
      onSearch(suggestion.name);
    }
    setShowSuggestions(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-caramel border-t-transparent"></div>
          </div>
        )}
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.Id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-caramel/10' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-caramel to-chocolate flex items-center justify-center">
                    <ApperIcon name="Cake" className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-chocolate truncate">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {suggestion.category} • ${suggestion.basePrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;