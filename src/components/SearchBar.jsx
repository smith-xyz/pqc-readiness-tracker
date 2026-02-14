import { useState, useRef, useEffect, useMemo } from 'react';

function SearchBar({ nodes, onSelect, inline }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return nodes
      .filter(n => n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, nodes]);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setQuery('');
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (node) => {
    onSelect(node);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={inline ? 'search-panel-inline' : 'hud-panel search-panel'} ref={containerRef}>
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search nodes... (Cmd+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(node => (
            <button key={node.id} className="search-result" onClick={() => handleSelect(node)}>
              <span className="result-name">{node.name}</span>
              <span className="result-type">{node.type.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
