import React, { useEffect, useRef, useState } from 'react';
import { Building2, ChevronDown, ChevronUp, RotateCcw, Search, SlidersHorizontal, User, X } from 'lucide-react';
import { REGIONS_DATA } from '../data/archiveData';
import { EventType, SchoolType, SearchFilterState } from '../types';

interface HeroSearchProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onQuickSearch: (query: string, type?: 'all' | 'teacher' | 'school') => void;
  sampleSuggestions: { name: string; type: 'teacher' | 'school'; desc: string }[];
}

const SCHOOL_TYPES: SchoolType[] = ['小学校', '中学校', '義務教育学校', '高等学校', '中等教育学校', '特別支援学校', '教育委員会', '教育事務所', '教育センター', 'その他公立教育機関'];
const EVENT_TYPES: EventType[] = ['転任', '新任', '新規採用', '昇任', '退職', '再任用', '指導主事等転出'];
const FISCAL_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export const HeroSearch: React.FC<HeroSearchProps> = ({ filters, onFilterChange, onQuickSearch, sampleSuggestions }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const activeAdvancedCount = [filters.prefecture, filters.municipality, filters.schoolType, filters.fiscalYear, filters.eventType].filter(Boolean).length;
  const suggestions = sampleSuggestions.slice(0, filters.query.trim() ? 8 : 5);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const resetFilters = () => onFilterChange({ query: '', searchType: 'all', prefecture: '', municipality: '', schoolType: '', fiscalYear: '', eventType: '' });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSuggestions(false);
    onQuickSearch(filters.query, filters.searchType);
  };

  return (
    <section className="v2-hero" aria-labelledby="v2-hero-title">
      <div className="v2-hero-inner">
        <div className="v2-hero-copy">
          <p className="v2-eyebrow">THE OPEN INDEX / 公立学校人事アーカイブ</p>
          <h1 id="v2-hero-title">学校を、引く。<br />先生の歩みを、たどる。</h1>
          <p className="v2-lead">学校のこと、先生のこと、地域のこと。公報に残る記録を、索引をめくるように探せます。</p>

          <div className="v2-search-modes" aria-label="検索対象">
            {([['all', 'すべて'], ['teacher', '先生'], ['school', '学校']] as const).map(([value, label]) => (
              <button key={value} type="button" className={filters.searchType === value ? 'is-active' : ''} onClick={() => onFilterChange({ ...filters, searchType: value })}>{label}</button>
            ))}
          </div>

          <div className="v2-search-wrap" ref={searchRef}>
            <form className="v2-search-box" onSubmit={submit}>
              <Search aria-hidden="true" />
              <input value={filters.query} onChange={(event) => onFilterChange({ ...filters, query: event.target.value })} onFocus={() => setShowSuggestions(true)} placeholder="先生の氏名、学校名、地域名を入力" aria-label="先生または学校を検索" />
              {filters.query && <button type="button" className="v2-search-clear" onClick={() => onFilterChange({ ...filters, query: '' })} aria-label="検索語を消す"><X /></button>}
              <button type="submit" className="v2-search-submit">索引を引く</button>
            </form>

            {showSuggestions && (
              <div className="v2-suggestions" role="listbox" aria-label="検索候補">
                <div className="v2-suggestions-head"><span>{filters.query ? '検索候補' : '索引から選ぶ'}</span><small>クリックで検索</small></div>
                {suggestions.map((item) => (
                  <button key={`${item.type}-${item.name}`} type="button" onClick={() => { onQuickSearch(item.name, item.type); setShowSuggestions(false); }}>
                    <span className={`v2-suggestion-icon ${item.type}`}>{item.type === 'teacher' ? <User /> : <Building2 />}</span>
                    <span><b>{item.name}</b><small>{item.desc}</small></span>
                    <em>見る</em>
                  </button>
                ))}
                {suggestions.length === 0 && <p className="v2-suggestions-empty">候補がありません。語句を短くしてお試しください。</p>}
              </div>
            )}
          </div>

          <div className="v2-search-hints">
            <span>たとえば</span>
            {['佐藤', '桜丘中学校', '世田谷区'].map((value) => <button type="button" key={value} onClick={() => onQuickSearch(value)}>「{value}」</button>)}
            <button type="button" className="v2-filter-toggle" onClick={() => setShowAdvanced(!showAdvanced)}><SlidersHorizontal /> 詳細条件 {activeAdvancedCount > 0 && <b>{activeAdvancedCount}</b>} {showAdvanced ? <ChevronUp /> : <ChevronDown />}</button>
          </div>
        </div>

        <div className="v2-index-artwork" aria-hidden="true">
          <div className="v2-paper paper-back"><span>地域</span><b>南関東</b></div>
          <div className="v2-paper paper-mid"><span>学校</span><b>15,112 校</b></div>
          <div className="v2-paper paper-front"><span>先生</span><strong>人事の記録を<br />一冊の索引に。</strong><i>OPEN INDEX</i></div>
          <div className="v2-seal">南関東<br />先行公開</div>
        </div>
      </div>

      {showAdvanced && (
        <div className="v2-filter-panel">
          <div className="v2-filter-panel-head"><div><span>FILTER</span><b>詳しく絞り込む</b></div>{activeAdvancedCount > 0 && <button type="button" onClick={resetFilters}><RotateCcw /> 条件をリセット</button>}</div>
          <div className="v2-filter-grid">
            <label>都道府県<select value={filters.prefecture} onChange={(event) => onFilterChange({ ...filters, prefecture: event.target.value })}><option value="">すべて</option>{REGIONS_DATA.map((region) => <optgroup key={region.name} label={region.name}>{region.prefectures.map((prefecture) => <option key={prefecture}>{prefecture}</option>)}</optgroup>)}</select></label>
            <label>市区町村<input value={filters.municipality} onChange={(event) => onFilterChange({ ...filters, municipality: event.target.value })} placeholder="例：世田谷区" /></label>
            <label>学校種<select value={filters.schoolType} onChange={(event) => onFilterChange({ ...filters, schoolType: event.target.value })}><option value="">すべて</option>{SCHOOL_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label>年度<select value={filters.fiscalYear} onChange={(event) => onFilterChange({ ...filters, fiscalYear: event.target.value })}><option value="">すべて</option>{FISCAL_YEARS.map((year) => <option key={year} value={year}>{year}年度</option>)}</select></label>
            <label>異動種別<select value={filters.eventType} onChange={(event) => onFilterChange({ ...filters, eventType: event.target.value })}><option value="">すべて</option>{EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
          </div>
        </div>
      )}
    </section>
  );
};
