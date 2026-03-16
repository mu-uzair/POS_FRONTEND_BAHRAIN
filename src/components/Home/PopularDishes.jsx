import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaWifi, FaExclamationTriangle, FaSearch, FaTimes, FaClock } from 'react-icons/fa';
import { getDishes, getCategories, getPopularDishes } from '../../https/index';
import { popularDishes as fallbackDishes } from '../../constants';
import { useOfflineMode } from '../../constants/OfflineModeContext';
import { OfflineError } from '../../utils/smartRequest';


 
const deduplicateDishes = (dishes) => {
  const map = new Map();

  dishes.forEach((dish) => {
    // Canonical key: lower-cased name + variation (or empty string)
    const key = `${dish.name?.trim().toLowerCase()}__${(dish.variation || '').trim().toLowerCase()}`;

    if (map.has(key)) {
      const existing = map.get(key);
      map.set(key, {
        ...existing,
        totalQuantity: (existing.totalQuantity || 0) + (dish.totalQuantity || 0),
        totalOrders:   (existing.totalOrders   || 0) + (dish.totalOrders   || 0),
        totalRevenue:  (existing.totalRevenue   || 0) + (dish.totalRevenue  || 0),
      });
    } else {
      map.set(key, { ...dish });
    }
  });

  return Array.from(map.values());
};


const buildDishKey = (dish, index) => {
  const name      = dish.name?.trim().toLowerCase()      || 'unknown';
  const variation = dish.variation?.trim().toLowerCase() || 'default';
  // Append index as a final disambiguator — even if two entries somehow
  // share the same name+variation after deduplication, the key stays unique.
  return `${name}__${variation}__${index}`;
};



const PopularDishes = () => {
  const [dateFilter, setDateFilter]                   = useState('All');
  const [selectedDate, setSelectedDate]               = useState('');
  const [searchQuery, setSearchQuery]                 = useState('');
  const [debouncedQuery, setDebouncedQuery]           = useState('');
  const [searchHistory, setSearchHistory]             = useState([]);
  const [showSuggestions, setShowSuggestions]         = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const searchInputRef  = useRef(null);
  const suggestionsRef  = useRef(null);

  const { isOfflineMode } = useOfflineMode();

  // ── Load search history ──────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dishSearchHistory');
      if (saved) setSearchHistory(JSON.parse(saved));
    } catch {
      // Corrupt storage — silently ignore
    }
  }, []);

  // ── Debounce search ──────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Close suggestions on outside click ──────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current  && !suggestionsRef.current.contains(e.target) &&
        searchInputRef.current  && !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Date params ──────────────────────────────────────────
  const { dateRange, startDate, endDate } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case 'Today': {
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        return { startDate: today.toISOString(), endDate: endOfDay.toISOString(), dateRange: null };
      }
      case 'Yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        return { startDate: yesterday.toISOString(), endDate: endOfYesterday.toISOString(), dateRange: null };
      }
      case 'Custom': {
        if (selectedDate) {
          const selected = new Date(selectedDate);
          selected.setHours(0, 0, 0, 0);
          const endOfSelected = new Date(selected);
          endOfSelected.setHours(23, 59, 59, 999);
          return { startDate: selected.toISOString(), endDate: endOfSelected.toISOString(), dateRange: null };
        }
        return { dateRange: 30, startDate: null, endDate: null };
      }
      default: // 'All'
        return { dateRange: 365, startDate: null, endDate: null };
    }
  }, [dateFilter, selectedDate]);

  // ── Queries ──────────────────────────────────────────────
  const { data: popularDishesData, isLoading, isError, error } = useQuery({
    queryKey: ['popular-dishes', dateFilter, selectedDate, dateRange, startDate, endDate],
    queryFn:  () => getPopularDishes(100, dateRange, startDate, endDate),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: dishesRes } = useQuery({
    queryKey: ['dishes'],
    queryFn:  getDishes,
    staleTime: 300_000,
    retry: false,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn:  getCategories,
    staleTime: 300_000,
    retry: false,
  });

  const dishesArray     = dishesRes?.data?.data     || dishesRes?.data     || [];
  const categoriesArray = categoriesRes?.data?.data || categoriesRes?.data || [];

  // ── FIX: Deduplicate raw API data before building enriched list ──
  const rawDishes      = popularDishesData?.data || [];
  const uniqueRawDishes = useMemo(() => deduplicateDishes(rawDishes), [rawDishes]);

  const isOfflineError = error instanceof OfflineError || error?.isOffline;

  // ── Enrich with images ───────────────────────────────────
  const enrichedDishes = useMemo(() => {
    const fallbackByName = new Map(
      fallbackDishes.map((d) => [d.name?.trim().toLowerCase(), d])
    );

    return uniqueRawDishes.map((dish, index) => {
      const dishNameLower = dish.name?.trim().toLowerCase();

      const dishObj = dishesArray.find(
        (d) => d.dishName?.trim().toLowerCase() === dishNameLower
      );

      let image = dishObj?.imageUrl || dishObj?.image;

      if (!image && dishObj?.category) {
        const cat = categoriesArray.find((c) => String(c._id) === String(dishObj.category));
        if (cat?.imageUrl) image = cat.imageUrl;
      }

      if (!image) {
        image = fallbackByName.get(dishNameLower)?.image;
      }

      const displayName = dish.variation
        ? `${dish.name} (${dish.variation})`
        : dish.name;

      return {
        // ✅ FIX: Use buildDishKey — guaranteed unique even if API returns
        //         duplicate name+variation entries after deduplication.
        key:         buildDishKey(dish, index),
        name:        dish.name,
        variation:   dish.variation,
        displayName,
        count:       dish.totalQuantity,
        totalOrders: dish.totalOrders,
        revenue:     dish.totalRevenue,
        image,
      };
    });
  }, [uniqueRawDishes, dishesArray, categoriesArray]);

  // ── Suggestions ──────────────────────────────────────────
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchHistory.slice(0, 5).map((term) => ({ type: 'history', text: term }));
    }
    const query = searchQuery.toLowerCase().trim();
    return enrichedDishes
      .filter(
        (d) =>
          d.displayName.toLowerCase().includes(query) ||
          d.name.toLowerCase().includes(query) ||
          d.variation?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map((d) => ({ type: 'match', text: d.displayName, count: d.count }));
  }, [searchQuery, enrichedDishes, searchHistory]);

  // ── Filter ───────────────────────────────────────────────
  const filteredDishes = useMemo(() => {
    if (!debouncedQuery.trim()) return enrichedDishes;

    const query = debouncedQuery.toLowerCase().trim();
    const exact = [], startsWith = [], contains = [];

    enrichedDishes.forEach((dish) => {
      const dn  = dish.displayName.toLowerCase();
      const n   = dish.name.toLowerCase();
      const v   = dish.variation?.toLowerCase() || '';

      if (!dn.includes(query) && !n.includes(query) && !v.includes(query)) return;

      if (dn === query || n === query)                        exact.push(dish);
      else if (dn.startsWith(query) || n.startsWith(query))  startsWith.push(dish);
      else                                                    contains.push(dish);
    });

    return [...exact, ...startsWith, ...contains];
  }, [enrichedDishes, debouncedQuery]);

  // ── Handlers ─────────────────────────────────────────────
  const saveHistory = (query) => {
    const next = [query, ...searchHistory.filter((h) => h !== query)].slice(0, 10);
    setSearchHistory(next);
    try { localStorage.setItem('dishSearchHistory', JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleSearch        = (value) => { setSearchQuery(value); setShowSuggestions(true); setSelectedSuggestionIndex(-1); };
  const handleSearchSubmit  = (query) => { if (!query.trim()) return; saveHistory(query); setSearchQuery(query); setDebouncedQuery(query); setShowSuggestions(false); };
  const handleSuggestionClick = (s)   => handleSearchSubmit(s.text);

  const clearSearch = () => {
    setSearchQuery(''); setDebouncedQuery(''); setShowSuggestions(false); setSelectedSuggestionIndex(-1);
    searchInputRef.current?.focus();
  };

  const removeFromHistory = (term, e) => {
    e.stopPropagation();
    const next = searchHistory.filter((h) => h !== term);
    setSearchHistory(next);
    try { localStorage.setItem('dishSearchHistory', JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setSelectedSuggestionIndex((p) => Math.min(p + 1, suggestions.length - 1)); break;
      case 'ArrowUp':   e.preventDefault(); setSelectedSuggestionIndex((p) => Math.max(p - 1, -1)); break;
      case 'Enter':     e.preventDefault(); selectedSuggestionIndex >= 0 ? handleSuggestionClick(suggestions[selectedSuggestionIndex]) : handleSearchSubmit(searchQuery); break;
      case 'Escape':    setShowSuggestions(false); setSelectedSuggestionIndex(-1); break;
    }
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-bold text-[#02ca3a]">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="mt-4 sm:mt-6 px-4 sm:px-6 lg:pr-6 lg:px-0">
      <div className="bg-[#1a1a1a] w-full rounded-lg relative">

        {/* Offline badge */}
        {isOfflineMode && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 rounded-full px-3 py-1">
              <FaWifi className="text-orange-400" size={12} />
              <span className="text-orange-400 text-xs font-semibold">Offline</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
              Popular Dishes
            </h1>
            {isOfflineMode && <span className="text-orange-400 text-xs">(Offline)</span>}
          </div>
          <a
            href="#"
            className={`text-[#025cca] text-xs sm:text-sm font-semibold ${isOfflineMode ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
            onClick={(e) => isOfflineMode && e.preventDefault()}
            title={isOfflineMode ? 'Not available in offline mode' : ''}
          >
            View All
          </a>
        </div>

        {/* Date filters */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {['All', 'Today', 'Yesterday', 'Custom'].map((f) => (
              <button
                key={f}
                onClick={() => !isOfflineMode && setDateFilter(f)}
                disabled={isOfflineMode}
                className={`text-[#ababab] text-xs sm:text-sm rounded-lg px-2 sm:px-3 py-1 font-semibold whitespace-nowrap transition-opacity
                  ${dateFilter === f ? 'bg-[#383838]' : ''}
                  ${isOfflineMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {f === 'All' ? 'All Dates' : f}
              </button>
            ))}
            {dateFilter === 'Custom' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => !isOfflineMode && setSelectedDate(e.target.value)}
                disabled={isOfflineMode}
                className={`bg-[#383838] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm ${isOfflineMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            )}
          </div>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 relative">
          <div className="relative">
            <div className={`flex items-center bg-[#2a2a2a] rounded-xl border-2 transition-all
              ${showSuggestions && (searchQuery || suggestions.length > 0)
                ? 'border-[#02ca3a] shadow-lg shadow-[#02ca3a]/20 rounded-b-none'
                : 'border-[#383838] hover:border-[#444444]'}`}
            >
              <FaSearch className="ml-4 text-[#ababab]" size={16} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search dishes by name or variation..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-[#f5f5f5] px-3 py-3 text-sm outline-none placeholder:text-[#7a7a7a]"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="mr-3 p-1.5 text-[#ababab] hover:text-[#f5f5f5] hover:bg-[#383838] rounded-full transition-all">
                  <FaTimes size={14} />
                </button>
              )}
              {isLoading && debouncedQuery && (
                <div className="mr-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#02ca3a] border-t-transparent" />
                </div>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (searchQuery || suggestions.length > 0) && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 right-0 bg-[#2a2a2a] border-2 border-t-0 border-[#02ca3a] rounded-b-xl shadow-xl max-h-[300px] overflow-y-auto z-50"
              >
                {suggestions.length > 0 ? (
                  <div className="py-1">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={`suggestion-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors
                          ${selectedSuggestionIndex === index ? 'bg-[#383838]' : 'hover:bg-[#333333]'}`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {suggestion.type === 'history'
                            ? <FaClock className="text-[#7a7a7a] flex-shrink-0" size={14} />
                            : <FaSearch className="text-[#7a7a7a] flex-shrink-0" size={14} />
                          }
                          <span className="text-[#f5f5f5] text-sm truncate">
                            {suggestion.type === 'match'
                              ? highlightMatch(suggestion.text, searchQuery)
                              : suggestion.text}
                          </span>
                          {suggestion.count !== undefined && (
                            <span className="text-[#7a7a7a] text-xs ml-auto flex-shrink-0">
                              {suggestion.count} orders
                            </span>
                          )}
                        </div>
                        {suggestion.type === 'history' && (
                          <button
                            onClick={(e) => removeFromHistory(suggestion.text, e)}
                            className="ml-2 p-1 text-[#7a7a7a] hover:text-[#f5f5f5] flex-shrink-0"
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="px-4 py-3 text-[#7a7a7a] text-sm text-center">
                    No dishes found for &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {debouncedQuery && (
            <div className="flex items-center justify-between mt-2 text-xs">
              <p className="text-[#ababab]">
                {filteredDishes.length === 0
                  ? <span className="text-orange-400">No results found</span>
                  : <>Found <span className="text-[#02ca3a] font-semibold">{filteredDishes.length}</span> dish{filteredDishes.length !== 1 ? 'es' : ''}</>
                }
              </p>
              {filteredDishes.length > 0 && (
                <p className="text-[#7a7a7a]">Search time: ~0.3s</p>
              )}
            </div>
          )}
        </div>

        {/* Dish list */}
        <div className="overflow-y-auto h-[400px] sm:h-[500px] lg:h-[620px] scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mb-4" />
              <p className="text-[#ababab] text-sm">
                {isOfflineMode ? 'Loading cached data...' : 'Loading popular dishes...'}
              </p>
            </div>

          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              {isOfflineError || isOfflineMode ? (
                <>
                  <div className="mb-6 p-6 bg-orange-500/10 border-2 border-orange-500/30 rounded-2xl max-w-md">
                    <div className="flex flex-col items-center gap-4">
                      <FaWifi className="text-orange-400 text-5xl" />
                      <div className="text-center">
                        <h3 className="text-orange-400 text-lg font-bold mb-2">Offline Mode</h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          Analytics data requires an internet connection.
                        </p>
                        <p className="text-gray-400 text-xs">
                          Popular dishes will be available once you&apos;re back online.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-md p-4 bg-[#252525] rounded-lg">
                    <p className="text-gray-400 text-xs text-center">
                      💡 <span className="font-semibold">Tip:</span> Other features like viewing orders and tables still work offline.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />
                  <p className="text-red-400 text-base sm:text-lg font-semibold mb-2">Failed to load dishes</p>
                  <p className="text-gray-400 text-sm text-center px-4">Please try again later</p>
                </>
              )}
            </div>

          ) : filteredDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="text-gray-400 text-4xl">
                {debouncedQuery ? '🔍' : isOfflineMode ? '📦' : '📊'}
              </div>
              <p className="text-[#ababab] text-base sm:text-lg font-semibold">
                {debouncedQuery ? 'No dishes found' : isOfflineMode ? 'No cached data available' : 'No records found'}
              </p>
              {debouncedQuery && (
                <>
                  <p className="text-[#7a7a7a] text-sm text-center px-4">Try searching with different keywords</p>
                  <button onClick={clearSearch} className="text-[#02ca3a] text-sm hover:underline font-semibold">
                    Clear search
                  </button>
                </>
              )}
              {isOfflineMode && !debouncedQuery && (
                <p className="text-gray-500 text-sm text-center px-4">
                  Analytics will be available when you&apos;re online
                </p>
              )}
            </div>

          ) : (
            <>
              {isOfflineMode && filteredDishes.length > 0 && (
                <div className="mx-4 sm:mx-6 mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaWifi className="text-orange-400 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-orange-400 text-sm font-semibold">Viewing Cached Analytics</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Data may be outdated. Connect to internet for latest statistics.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {filteredDishes.map((dish, idx) => (
                // ✅ FIX: Use dish.key (built with buildDishKey) — always unique
                <div
                  key={dish.key}
                  className="flex items-center gap-3 sm:gap-4 bg-[#1f1f1f] rounded-[15px] px-3 sm:px-4 py-3 sm:py-4 mx-4 sm:mx-6 mb-3 sm:mb-5 hover:bg-[#252525] transition-colors"
                >
                  <h1 className="text-[#f5f5f5] font-bold text-base sm:text-xl mr-2 sm:mr-4 flex-shrink-0">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </h1>
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-[#383838] flex items-center justify-center text-xs sm:text-sm text-[#ababab] flex-shrink-0">
                      Img
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm sm:text-base truncate">
                      {dish.displayName}
                    </h1>
                    <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-1">
                      <span className="text-[#ababab]">orders: </span>
                      {dish.count}
                    </p>
                  </div>
                  {isOfflineMode && (
                    <div className="flex-shrink-0">
                      <span className="text-orange-400 text-xs px-2 py-1 bg-orange-500/10 rounded-full">Cached</span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;