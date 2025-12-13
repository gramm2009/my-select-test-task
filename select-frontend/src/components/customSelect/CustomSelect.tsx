import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  KeyboardEvent,
  ChangeEvent,
  useMemo
} from 'react';
import './styles.css';

import { SelectOption, CustomSelectProps } from './types';

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Выберите опцию...",
  onChange,
  isLoading = false,
  error = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [filterText, setFilterText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [dropdownDirection] = useState<'down' | 'up'>('down');
  const [showClearButton, setShowClearButton] = useState(false);
  
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredOptions = useMemo(() => {
    if (!filterText) return options;
    
    return options.filter(option => 
      option.name.toLowerCase().startsWith(filterText.toLowerCase())
    );
  }, [options, filterText]);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilterText('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (filterText && filteredOptions.length > 0) {
      setHighlightedIndex(0);
      
      setTimeout(() => {
        if (optionRefs.current[0]) {
          optionRefs.current[0]?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
          });
        }
      }, 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [filterText, filteredOptions]);

  useEffect(() => {
    if (isOpen && selectedOption) {
      const selectedIndex = options.findIndex(opt => opt.value === selectedOption.value);
      if (selectedIndex >= 0) {
        setHighlightedIndex(selectedIndex);
        
        setTimeout(() => {
          if (optionRefs.current[selectedIndex]) {
            optionRefs.current[selectedIndex]?.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth'
            });
          }
        }, 0);
      }
    }
  }, [isOpen, selectedOption, options]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setFilterText(numericValue);
    
    if (numericValue && !isOpen) {
      setIsOpen(true);
    }
    
    if (numericValue) {
      const exactMatch = options.find(opt => opt.name === numericValue);
      if (exactMatch) {
        const matchIndex = options.findIndex(opt => opt.name === numericValue);
        if (matchIndex >= 0) {
          setHighlightedIndex(matchIndex);
          
          setTimeout(() => {
            if (optionRefs.current[matchIndex]) {
              optionRefs.current[matchIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
              });
            }
          }, 0);
        }
      }
    }
  };

  const handleOptionSelect = (option: SelectOption) => {
    setFilterText('');
    setSelectedOption(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange?.(option.value);
    setShowClearButton(false)
  };

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setIsOpen(true);
        setFilterText('');
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setFilterText('');
        setHighlightedIndex(-1);
        break;
        
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else if (filterText && filteredOptions.length === 1) {
          handleOptionSelect(filteredOptions[0]);
        }
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = prev < filteredOptions.length - 1 ? prev + 1 : prev;
          
          setTimeout(() => {
            if (optionRefs.current[newIndex]) {
              optionRefs.current[newIndex]?.scrollIntoView({
                block: 'nearest'
              });
            }
          }, 0);
          
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : 0;
          
          setTimeout(() => {
            if (optionRefs.current[newIndex]) {
              optionRefs.current[newIndex]?.scrollIntoView({
                block: 'nearest'
              });
            }
          }, 0);
          
          return newIndex;
        });
        break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, filterText]);

  return (
    <div className="custom-select-container">
      <div 
        ref={selectRef}
        className={`custom-select ${isOpen ? 'open' : ''} ${selectedOption ? 'has-value' : ''}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setHighlightedIndex(0)}
        onMouseEnter={() => setShowClearButton(true)}
        onMouseLeave={() => setShowClearButton(false)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="custom-select-dropdown"
      >
        <div className="select-main" onClick={() => setIsOpen(!isOpen)}>
          <div className="select-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="select-input"
              value={isOpen ? filterText : selectedOption?.name || ''}
              onChange={handleFilterChange}
              placeholder={placeholder}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              onFocus={() => {
                if (!isOpen) {
                  setIsOpen(true);
                }
              }}
              aria-autocomplete="list"
              aria-controls="custom-select-dropdown"
            />
            
            {selectedOption && showClearButton && (
              <button 
                className="clear-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOption(null);
                  setFilterText('');
                  setHighlightedIndex(-1);
                  onChange?.('');
                }}
                aria-label="Очистить выбор"
              >
                &#10006;
              </button>
            )}
          </div>
          
          <button 
            className={`dropdown-toggle ${isOpen ? 'open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
              if (!isOpen) {
                setFilterText('');
              }
            }}
            aria-label={isOpen ? "Закрыть список" : "Открыть список"}
          >
            ▼
          </button>
        </div>

        {isOpen && (
          <div 
            ref={dropdownRef}
            id="custom-select-dropdown"
            className={`dropdown-menu ${dropdownDirection}`}
            role="listbox"
            aria-label="Опции выбора"
          >
            {isLoading ? (
              <div className="dropdown-loading">Загрузка...</div>
            ) : error ? (
              <div className="dropdown-error">{error}</div>
            ) : filteredOptions.length === 0 ? (
              <div className="dropdown-empty">
                {filterText ? `Опции "${filterText}" не найдены` : 'Нет опций'}
              </div>
            ) : (
              <div className="dropdown-content">
                {filteredOptions.map((option, index) => {
                  const isSelected = selectedOption?.value === option.value;
                  const isHighlighted = highlightedIndex === index;
                  
                  return (
                    <div
                      key={`${option.value}-${option.name}`}
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      className={`dropdown-option 
                        ${isSelected ? 'selected' : ''} 
                        ${isHighlighted ? 'highlighted' : ''}`}
                      onClick={() => handleOptionSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      data-value={option.value}
                    >
                      {option.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;