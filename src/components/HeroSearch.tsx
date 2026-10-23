import React, { useState, useRef, useEffect } from 'react';
import { SearchFilterState, SchoolType, EventType } from '../types';
import { REGIONS_DATA } from '../data/archiveData';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Building2, 
  User, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSearchProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onQuickSearch: (query: string, type?: 'all' | 'teacher' | 'school') => void;
  sampleSuggestions: { name: string; type: 'teacher' | 'school'; desc: string }[];
}

const SCHOOL_TYPES: SchoolType[] = [
  '小学校',
  '中学校',
  '義務教育学校',
  '高等学校',
  '中等教育学校',
  '特別支援学校',
  '教育委員会',
  '教育事務所',
  '教育センター',
  'その他公立教育機関',
];

const EVENT_TYPES: EventType[] = [
  '転任',
  '新任',
  '新規採用',
  '昇任',
  '退職',
  '再任用',
  '指導主事等転出',
];

const FISCAL_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onFilterChange,
  onQuickSearch,
  sampleSuggestions,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (q: string) => {
    onFilterChange({ ...filters, query: q });
  };

  const handleTypeTabChange = (type: 'all' | 'teacher' | 'school') => {
    onFilterChange({ ...filters, searchType: type });
  };

  const handleResetFilters = () => {
    onFilterChange({
      query: '',
      searchType: 'all',
      prefecture: '',
      municipality: '',
      schoolType: '',
      fiscalYear: '',
      eventType: '',
    });
  };

  const activeAdvancedCount = [
    filters.prefecture,
    filters.municipality,
    filters.schoolType,
    filters.fiscalYear,
    filters.eventType,
  ].filter(Boolean).length;

  const filteredSuggestions = sampleSuggestions.slice(0, filters.query.trim() ? 8 : 5);

  return (
    <div className="data-hero relative z-30 bg-gradient-to-br from-[#07152f] via-[#123e82] to-[#342477] text-white pt-12 pb-16 px-4 sm:px-6 overflow-visible">
      {/* Subtle background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-indigo-300 blur-3xl" />
      </div>
      <div className="data-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="data-orbit data-orbit-one" aria-hidden="true"><span /></div>
      <div className="data-orbit data-orbit-two" aria-hidden="true"><span /></div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Subtitle & Brand Tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-cyan-300/30 text-blue-100 text-xs font-medium mb-4 backdrop-blur-xs"
        >
          <span>THE OPEN INDEX</span>
          <span aria-hidden="true">·</span>
          <span>公立学校人事アーカイブ</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-300 font-semibold">南関東先行公開中</span>
        </motion.div>

        {/* Main Copy */}
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5 }} className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          学校を、ひく。<br />先生の歩みを、たどる。
        </motion.h1>

        <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          学校のこと、先生のこと、地域のこと。気になるひとつを、索引をめくるように探せます。
        </p>

        {/* Search Mode Segmented Tabs */}
        <div className="inline-flex p-1 bg-blue-950/70 border border-blue-700/60 rounded-xl mb-4 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => handleTypeTabChange('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              filters.searchType === 'all'
                ? 'bg-white text-blue-950 shadow-sm font-semibold'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            すべて探す
          </button>
          <button
            type="button"
            onClick={() => handleTypeTabChange('teacher')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              filters.searchType === 'teacher'
                ? 'bg-white text-blue-950 shadow-sm font-semibold'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            先生を探す
          </button>
          <button
            type="button"
            onClick={() => handleTypeTabChange('school')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              filters.searchType === 'school'
                ? 'bg-white text-blue-950 shadow-sm font-semibold'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            学校を探す
          </button>
        </div>

        {/* Main Search Input Box */}
        <div ref={searchContainerRef} className="relative max-w-2xl mx-auto text-left">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl border-2 border-transparent focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
            <div className="pl-4 sm:pl-5 text-slate-400">
              <Search className="w-5 h-5 text-blue-600" />
            </div>

            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={
                filters.searchType === 'teacher'
                  ? '先生の氏名を入力 (例: 佐藤、鈴木、田中...)'
                  : filters.searchType === 'school'
                  ? '学校名を入力 (例: 桜丘中学校、日比谷高校、港南台小...)'
                  : '先生のお名前・学校名を入力 (例: 佐藤、桜丘中学校、世田谷区...)'
              }
              aria-label="先生または学校の検索"
              className="w-full py-4 pl-3 pr-24 text-slate-900 placeholder-slate-400 text-sm sm:text-base font-normal bg-transparent focus:outline-none"
            />

            {filters.query && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-2 transition-colors"
                aria-label="検索ワードを消去"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="pr-2 sm:pr-3">
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                検索
              </button>
            </div>
          </div>

          {/* Autocomplete / Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-[100] overflow-hidden text-slate-800 animate-in fade-in-50 duration-100">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{filters.query ? '検索候補' : '検索キーワードの例'}</span>
                <span className="text-[11px] text-slate-400">クリックで直接検索</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onQuickSearch(item.name, item.type);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50/70 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.type === 'teacher' ? (
                        <div className="p-1.5 rounded-md bg-blue-100 text-blue-700">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm text-slate-800 group-hover:text-blue-700">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      検索する →
                    </span>
                  </button>
                ))}
                {filteredSuggestions.length === 0 && (
                  <div className="px-4 py-5 text-center text-xs text-slate-500">
                    候補がありません。表記を短くするか、地域名でお試しください。
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Search Suggestions chips & Advanced Filter Button */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-blue-200/80 mr-1">よく検索される例:</span>
          {['鈴木 雅彦', '佐藤 健一', '桜丘中学校', '日比谷高校', '警固中学校'].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onQuickSearch(tag)}
                className="px-2.5 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/50 transition-colors"
              >
                {tag}
              </button>
            )
          )}

          {/* Toggle Advanced Filters */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-800/80 hover:bg-blue-700 text-white border border-blue-600/60 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3 text-blue-200" />
            <span>詳細条件で絞り込む</span>
            {activeAdvancedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-500 text-[10px] font-bold">
                {activeAdvancedCount}
              </span>
            )}
            {showAdvanced ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvanced && (
          <div className="mt-6 max-w-3xl mx-auto bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-blue-700/60 text-left text-xs space-y-4 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-blue-800">
              <span className="font-semibold text-blue-100 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-300" />
                詳細絞り込み条件
              </span>
              {activeAdvancedCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>条件をすべてリセット</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Prefecture */}
              <div>
                <label className="block text-blue-200 font-medium mb-1">
                  都道府県
                </label>
                <select
                  value={filters.prefecture}
                  onChange={(e) =>
                    onFilterChange({ ...filters, prefecture: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-blue-700/70 rounded-lg p-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">すべての都道府県</option>
                  {REGIONS_DATA.map((region) => (
                    <optgroup key={region.name} label={`-- ${region.name} --`}>
                      {region.prefectures.map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Municipality */}
              <div>
                <label className="block text-blue-200 font-medium mb-1">
                  市区町村
                </label>
                <input
                  type="text"
                  value={filters.municipality}
                  onChange={(e) =>
                    onFilterChange({ ...filters, municipality: e.target.value })
                  }
                  placeholder="例: 世田谷区、豊中市..."
                  className="w-full bg-slate-800 border border-blue-700/70 rounded-lg p-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* School Type */}
              <div>
                <label className="block text-blue-200 font-medium mb-1">
                  学校種 / 教育機関
                </label>
                <select
                  value={filters.schoolType}
                  onChange={(e) =>
                    onFilterChange({ ...filters, schoolType: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-blue-700/70 rounded-lg p-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">すべての学校種</option>
                  {SCHOOL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fiscal Year */}
              <div>
                <label className="block text-blue-200 font-medium mb-1">
                  対象年度
                </label>
                <select
                  value={filters.fiscalYear}
                  onChange={(e) =>
                    onFilterChange({ ...filters, fiscalYear: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-blue-700/70 rounded-lg p-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">すべての年度</option>
                  {FISCAL_YEARS.map((y) => (
                    <option key={y} value={y.toString()}>
                      {y}年度
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-blue-200 font-medium mb-1">
                  人事異動種別
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) =>
                    onFilterChange({ ...filters, eventType: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-blue-700/70 rounded-lg p-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">すべての異動種別</option>
                  {EVENT_TYPES.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
