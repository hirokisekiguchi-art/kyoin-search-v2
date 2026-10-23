import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Building2, Check, ChevronRight, ExternalLink, MapPin, Plus, RotateCcw, SearchX, User } from 'lucide-react';
import { getSchoolGoogleMapsUrl } from '../data/archiveData';
import { School, SearchFilterState, TeacherCandidate } from '../types';

interface SearchResultsProps {
  teachers: TeacherCandidate[]; schools: School[]; filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onSelectTeacher: (teacher: TeacherCandidate) => void;
  onSelectSchoolById: (schoolId: string) => void;
  onSelectSchool: (school: School) => void;
  onToggleCompare: (school: School) => void;
  comparedSchoolIds: string[];
}

type ResultItem = { kind: 'teacher'; value: TeacherCandidate } | { kind: 'school'; value: School };
const PAGE_SIZE = 18;

export const SearchResults: React.FC<SearchResultsProps> = ({ teachers, schools, filters, onFilterChange, onSelectTeacher, onSelectSchoolById, onSelectSchool, onToggleCompare, comparedSchoolIds }) => {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const allItems = useMemo<ResultItem[]>(() => {
    const teacherItems: ResultItem[] = filters.searchType === 'school' ? [] : teachers.map((value) => ({ kind: 'teacher', value }));
    const schoolItems: ResultItem[] = filters.searchType === 'teacher' ? [] : schools.map((value) => ({ kind: 'school', value }));
    if (filters.searchType === 'teacher') return teacherItems;
    if (filters.searchType === 'school') return schoolItems;
    const mixed: ResultItem[] = [];
    for (let index = 0; index < Math.max(teacherItems.length, schoolItems.length); index += 1) {
      if (teacherItems[index]) mixed.push(teacherItems[index]);
      if (schoolItems[index]) mixed.push(schoolItems[index]);
    }
    return mixed;
  }, [filters.searchType, schools, teachers]);

  useEffect(() => setLimit(PAGE_SIZE), [filters]);
  const reset = () => onFilterChange({ query: '', searchType: 'all', prefecture: '', municipality: '', schoolType: '', fiscalYear: '', eventType: '' });
  const activeFilters = Object.entries(filters).filter(([key, value]) => key !== 'searchType' && Boolean(value)) as [keyof SearchFilterState, string][];
  const filterLabels: Partial<Record<keyof SearchFilterState, string>> = { query: '検索語', prefecture: '地域', municipality: '市区町村', schoolType: '学校種', fiscalYear: '年度', eventType: '異動' };

  return (
    <section className="v2-content-layout" aria-label="検索結果">
      <aside className="v2-index-sidebar">
        <p>INDEX</p><h2>目次</h2>
        <nav>
          <button className={filters.searchType === 'all' ? 'is-current' : ''} onClick={() => onFilterChange({ ...filters, searchType: 'all' })}><span>01</span>すべての記録</button>
          <button className={filters.searchType === 'teacher' ? 'is-current' : ''} onClick={() => onFilterChange({ ...filters, searchType: 'teacher' })}><span>02</span>先生から探す</button>
          <button className={filters.searchType === 'school' ? 'is-current' : ''} onClick={() => onFilterChange({ ...filters, searchType: 'school' })}><span>03</span>学校から探す</button>
          <a href="#regions"><span>04</span>地域から探す</a>
          <a href="#updates"><span>05</span>公報の新着</a>
        </nav>
        <div className="v2-index-note"><b>収録範囲</b><span>東京都・神奈川県<br />埼玉県・千葉県</span><small>南関東先行公開</small></div>
      </aside>

      <div className="v2-results-section">
        <nav className="v2-breadcrumb" aria-label="パンくず">教員サーチ <ChevronRight /> {filters.prefecture || '南関東'} <ChevronRight /> <b>{filters.query ? '検索結果' : '人事アーカイブ'}</b></nav>
        <div className="v2-results-heading">
          <div><p>ARCHIVE ENTRIES</p><h2>{filters.query ? `「${filters.query}」の索引` : '公立学校人事の索引'}</h2><span>公報をもとに収録した未照合候補を含みます</span></div>
          <strong>{allItems.length.toLocaleString('ja-JP')}<small> 件</small></strong>
        </div>

        <div className="v2-result-tabs">
          <button className={filters.searchType === 'all' ? 'is-active' : ''} onClick={() => onFilterChange({ ...filters, searchType: 'all' })}>すべて <span>{(teachers.length + schools.length).toLocaleString('ja-JP')}</span></button>
          <button className={filters.searchType === 'teacher' ? 'is-active' : ''} onClick={() => onFilterChange({ ...filters, searchType: 'teacher' })}>先生 <span>{teachers.length.toLocaleString('ja-JP')}</span></button>
          <button className={filters.searchType === 'school' ? 'is-active' : ''} onClick={() => onFilterChange({ ...filters, searchType: 'school' })}>学校 <span>{schools.length.toLocaleString('ja-JP')}</span></button>
        </div>

        {activeFilters.length > 0 && <div className="v2-active-filters">{activeFilters.map(([key, value]) => <button key={key} onClick={() => onFilterChange({ ...filters, [key]: '' })}><small>{filterLabels[key]}</small>{value}<span>×</span></button>)}<button className="v2-reset" onClick={reset}><RotateCcw />すべて解除</button></div>}

        {allItems.length === 0 ? (
          <div className="v2-zero"><SearchX /><h3>該当する記録は見つかりませんでした</h3><p>氏名を苗字だけにする、学校の正式名称を確認する、地域条件を広げるなどをお試しください。</p><button onClick={reset}>全アーカイブへ戻る</button></div>
        ) : (
          <>
            <ol className="v2-entry-list">
              {allItems.slice(0, limit).map((item, index) => item.kind === 'teacher' ? (
                <li className="v2-entry-row" key={`teacher-${item.value.id}-${index}`}>
                  <span className="v2-entry-number">{String(index + 1).padStart(2, '0')}</span><span className="v2-entry-symbol teacher"><User /></span>
                  <div className="v2-entry-main"><div className="v2-entry-meta"><span>先生</span><em>{item.value.prefecture}・{item.value.municipality}</em><time>{item.value.latestFiscalYear}年度</time></div><button className="v2-entry-title" onClick={() => onSelectTeacher(item.value)}>{item.value.name}</button><p>{item.value.currentPosition} ／ <button onClick={() => onSelectSchoolById(item.value.currentSchoolId)}>{item.value.currentSchoolName}</button></p><small>経歴 {item.value.timeline.length}件 ・ {item.value.verificationStatus}</small></div>
                  <button className="v2-entry-open" onClick={() => onSelectTeacher(item.value)} aria-label={`${item.value.name}の経歴を見る`}>経歴を見る <ArrowUpRight /></button>
                </li>
              ) : (
                <li className="v2-entry-row" key={`school-${item.value.id}-${index}`}>
                  <span className="v2-entry-number">{String(index + 1).padStart(2, '0')}</span><span className="v2-entry-symbol school"><Building2 /></span>
                  <div className="v2-entry-main"><div className="v2-entry-meta"><span>学校</span><em><MapPin />{item.value.prefecture}・{item.value.municipality}</em><time>{item.value.latestConfirmedYear}年度</time></div><button className="v2-entry-title" onClick={() => onSelectSchool(item.value)}>{item.value.name}</button><p>{item.value.schoolType} ／ {item.value.founder}</p><small>確認人事 {item.value.totalConfirmedPersonnelCount}件</small></div>
                  <div className="v2-entry-actions"><button className={comparedSchoolIds.includes(item.value.id) ? 'is-added' : ''} onClick={() => onToggleCompare(item.value)}>{comparedSchoolIds.includes(item.value.id) ? <Check /> : <Plus />}比較</button><a href={item.value.googleMapsUrl || getSchoolGoogleMapsUrl(item.value)} target="_blank" rel="noreferrer">口コミ <ExternalLink /></a><button className="v2-entry-open" onClick={() => onSelectSchool(item.value)}>学校を見る <ArrowUpRight /></button></div>
                </li>
              ))}
            </ol>
            {allItems.length > limit && <div className="v2-load-more"><button onClick={() => setLimit((value) => value + PAGE_SIZE)}>もう少し、めくる <span>＋{Math.min(PAGE_SIZE, allItems.length - limit)}件</span></button><p>{allItems.length.toLocaleString('ja-JP')}件中 {Math.min(limit, allItems.length).toLocaleString('ja-JP')}件を表示</p></div>}
          </>
        )}
      </div>
    </section>
  );
};
