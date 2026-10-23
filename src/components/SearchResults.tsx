import React, { useEffect, useState } from 'react';
import { TeacherCandidate, School, SearchFilterState } from '../types';
import { TeacherCard } from './TeacherCard';
import { SchoolCard } from './SchoolCard';
import { User, Building2, SearchX, RotateCcw, ChevronRight, LoaderCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchResultsProps {
  teachers: TeacherCandidate[];
  schools: School[];
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onSelectTeacher: (teacher: TeacherCandidate) => void;
  onSelectSchoolById: (schoolId: string) => void;
  onSelectSchool: (school: School) => void;
  onToggleCompare: (school: School) => void;
  comparedSchoolIds: string[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  teachers,
  schools,
  filters,
  onFilterChange,
  onSelectTeacher,
  onSelectSchoolById,
  onSelectSchool,
  onToggleCompare,
  comparedSchoolIds,
}) => {
  const PAGE_SIZE = 16;
  const [teacherLimit, setTeacherLimit] = useState(PAGE_SIZE);
  const [schoolLimit, setSchoolLimit] = useState(PAGE_SIZE);
  const showTeachers = filters.searchType === 'all' || filters.searchType === 'teacher';
  const showSchools = filters.searchType === 'all' || filters.searchType === 'school';
  const visibleTeachers = teachers.slice(0, teacherLimit);
  const visibleSchools = schools.slice(0, schoolLimit);

  useEffect(() => {
    setTeacherLimit(PAGE_SIZE);
    setSchoolLimit(PAGE_SIZE);
  }, [filters]);

  const totalResults = (showTeachers ? teachers.length : 0) + (showSchools ? schools.length : 0);

  const hasActiveFilters = Boolean(
    filters.query ||
      filters.prefecture ||
      filters.municipality ||
      filters.schoolType ||
      filters.fiscalYear ||
      filters.eventType
  );

  const handleClearTag = (key: keyof SearchFilterState) => {
    onFilterChange({
      ...filters,
      [key]: key === 'searchType' ? 'all' : '',
    });
  };

  const handleResetAll = () => {
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

  return (
    <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto" aria-label="検索結果">
      <nav aria-label="パンくず" className="mb-3 flex items-center gap-1 text-[11px] font-medium text-slate-500">
        <span>教員サーチ</span>
        <ChevronRight className="w-3 h-3" />
        <span>{filters.prefecture || '南関東'}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-blue-700">{filters.query ? '検索結果' : '人事アーカイブ'}</span>
      </nav>
      {/* Search Result Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <h2 className="text-xl font-bold tracking-tight">
              {filters.query ? `「${filters.query}」の検索結果` : '公立学校人事アーカイブ'}
            </h2>
            <span className="text-sm font-semibold text-slate-500">
              （{totalResults}件）
            </span>
          </div>
          {filters.query && (
            <p className="text-xs text-slate-500 mt-0.5">
              教育委員会告示・教職員人事異動公報の照合アーカイブより表示中
            </p>
          )}
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.prefecture && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <span>{filters.prefecture}</span>
                <button
                  onClick={() => handleClearTag('prefecture')}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="都道府県フィルターを解除"
                >
                  ×
                </button>
              </span>
            )}
            {filters.schoolType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <span>{filters.schoolType}</span>
                <button
                  onClick={() => handleClearTag('schoolType')}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="学校種フィルターを解除"
                >
                  ×
                </button>
              </span>
            )}
            {filters.fiscalYear && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <span>{filters.fiscalYear}年度</span>
                <button
                  onClick={() => handleClearTag('fiscalYear')}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="年度フィルターを解除"
                >
                  ×
                </button>
              </span>
            )}
            {filters.eventType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <span>{filters.eventType}</span>
                <button
                  onClick={() => handleClearTag('eventType')}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="異動種別フィルターを解除"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={handleResetAll}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline ml-1"
            >
              条件をクリア
            </button>
          </div>
        )}
      </div>

      {/* Zero State */}
      {totalResults === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            該当する公立学校・先生の記録は見つかりませんでした
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            現在確認できる公報データに一致する情報がありません。
            漢字の異体字（例: 斉藤/齊藤、渡辺/渡邊）や、学校の正式名称をお確かめの上、再度お試しください。
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-2 mb-6">
            <div className="font-semibold text-slate-700">検索のヒント:</div>
            <div>・お名前の苗字のみ（例: 「佐藤」）で検索してみる</div>
            <div>・学校名は「桜丘中学校」のように「中学校」や「高校」を含めてみる</div>
            <div>・都道府県・市区町村の条件を広げてみる</div>
          </div>

          <button
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>全アーカイブ一覧を表示</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {/* Teachers Section */}
          {showTeachers && teachers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-blue-100 text-blue-700">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    先生の検索結果
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    ({teachers.length}件)
                  </span>
                </div>
                {filters.searchType === 'all' && schools.length > 0 && (
                  <button
                    onClick={() => onFilterChange({ ...filters, searchType: 'teacher' })}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    先生のみに絞り込む →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleTeachers.map((teacher, index) => (
                  <motion.div key={teacher.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.28, delay: Math.min(index % PAGE_SIZE, 6) * 0.025 }}>
                    <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    onSelect={onSelectTeacher}
                    onSelectSchool={onSelectSchoolById}
                    />
                  </motion.div>
                ))}
              </div>
              {teachers.length > teacherLimit && (
                <div className="mt-6 text-center">
                  <button onClick={() => setTeacherLimit((value) => value + PAGE_SIZE)} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md">
                    <LoaderCircle className="w-4 h-4" />
                    さらに{Math.min(PAGE_SIZE, teachers.length - teacherLimit)}件表示
                  </button>
                  <p className="mt-2 text-[11px] text-slate-400">{teachers.length.toLocaleString('ja-JP')}件中 {visibleTeachers.length.toLocaleString('ja-JP')}件を表示</p>
                </div>
              )}
            </div>
          )}

          {/* Schools Section */}
          {showSchools && schools.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-emerald-100 text-emerald-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    学校・教育機関の検索結果
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    ({schools.length}件)
                  </span>
                </div>
                {filters.searchType === 'all' && teachers.length > 0 && (
                  <button
                    onClick={() => onFilterChange({ ...filters, searchType: 'school' })}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    学校のみに絞り込む →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleSchools.map((school, index) => (
                  <motion.div key={school.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.28, delay: Math.min(index % PAGE_SIZE, 6) * 0.025 }}>
                    <SchoolCard
                    key={school.id}
                    school={school}
                    onSelect={onSelectSchool}
                    onToggleCompare={onToggleCompare}
                    isCompared={comparedSchoolIds.includes(school.id)}
                    />
                  </motion.div>
                ))}
              </div>
              {schools.length > schoolLimit && (
                <div className="mt-6 text-center">
                  <button onClick={() => setSchoolLimit((value) => value + PAGE_SIZE)} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md">
                    <LoaderCircle className="w-4 h-4" />
                    さらに{Math.min(PAGE_SIZE, schools.length - schoolLimit)}件表示
                  </button>
                  <p className="mt-2 text-[11px] text-slate-400">{schools.length.toLocaleString('ja-JP')}件中 {visibleSchools.length.toLocaleString('ja-JP')}件を表示</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
