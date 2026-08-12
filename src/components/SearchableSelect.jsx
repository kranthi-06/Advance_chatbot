import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Plus, Search } from 'lucide-react';

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  icon: Icon,
  disabled = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  allowCustomValue = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = useMemo(
    () => options.find((option) => option.key === value),
    [options, value]
  );

  const displayLabel =
    selectedOption?.name ||
    (allowCustomValue && typeof value === 'string' && value.trim() ? value.trim() : '');

  const filteredOptions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return options;

    return options.filter((option) =>
      [option.name, option.description, option.searchTerms]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [options, searchTerm]);

  const trimmedSearch = searchTerm.trim();
  const canUseCustomValue =
    allowCustomValue &&
    trimmedSearch &&
    !options.some(
      (option) =>
        option.name?.toLowerCase() === trimmedSearch.toLowerCase() ||
        String(option.key).toLowerCase() === trimmedSearch.toLowerCase()
    );

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
    setSearchTerm('');
  }

  return (
    <div ref={wrapperRef} className={`relative ${disabled ? 'opacity-60' : ''}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setIsOpen((current) => !current);
          setSearchTerm('');
        }}
        className="w-full rounded-2xl border px-4 py-3.5 text-left transition-all duration-200"
        style={{
          background: 'var(--bg-primary)',
          borderColor: isOpen ? 'rgba(46, 160, 67, 0.55)' : 'var(--glass-border)',
          color: 'var(--text-primary)',
          boxShadow: isOpen ? '0 0 0 3px rgba(46, 160, 67, 0.08)' : 'none',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {Icon ? (
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(46, 160, 67, 0.12)', color: '#2ea043' }}
              >
                <Icon className="h-5 w-5" />
              </span>
            ) : null}

            <div className="min-w-0">
              <div className="truncate font-medium">
                {displayLabel || (
                  <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>
                )}
              </div>
              {selectedOption?.description ? (
                <div className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                  {selectedOption.description}
                </div>
              ) : null}
            </div>
          </div>

          <ChevronDown
            className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          />
        </div>
      </button>

      {isOpen && !disabled ? (
        <div
          className="absolute z-50 mt-3 w-full overflow-hidden rounded-3xl border"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--glass-border)',
            boxShadow: '0 22px 48px rgba(0, 0, 0, 0.24)',
          }}
        >
          <div
            className="border-b p-3"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--glass-border)',
            }}
          >
            <div
              className="flex items-center gap-3 rounded-2xl border px-3 py-2.5"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--glass-border)',
              }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {canUseCustomValue ? (
              <button
                type="button"
                onClick={() => handleSelect(trimmedSearch)}
                className="mb-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/5"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(56, 189, 248, 0.14)', color: '#38bdf8' }}
                >
                  <Plus className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Use "{trimmedSearch}"
                  </div>
                  <div className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                    Create a custom selection from your typed value
                  </div>
                </div>
              </button>
            ) : null}

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-5 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                {emptyMessage}
              </div>
            ) : (
              <ul className="space-y-1">
                {filteredOptions.map((option) => {
                  const isSelected = value === option.key;

                  return (
                    <li key={option.key}>
                      <button
                        type="button"
                        onClick={() => handleSelect(option.key)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/5"
                        style={{
                          background: isSelected ? 'rgba(46, 160, 67, 0.12)' : 'transparent',
                          color: isSelected ? '#57d364' : 'var(--text-primary)',
                        }}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{option.name}</div>
                          {option.description ? (
                            <div className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                              {option.description}
                            </div>
                          ) : null}
                        </div>

                        {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
