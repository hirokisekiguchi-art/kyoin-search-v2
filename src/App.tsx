/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  TeacherCandidate, 
  School, 
  SearchFilterState, 
  OfficialSource, 
  RecentGazetteUpdate,
  PersonnelObservation,
  AuditLogItem 
} from './types';
import { 
  INITIAL_TEACHERS, 
  INITIAL_SCHOOLS, 
  RECENT_UPDATES_DATA, 
  INITIAL_OBSERVATIONS, 
  INITIAL_AUDIT_LOGS,
  OFFICIAL_SOURCES_DATA 
} from './data/archiveData';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { SearchResults } from './components/SearchResults';
import { ArchiveDetailPage } from './components/ArchiveDetailPage';
import { SourceDetailsModal } from './components/SourceDetailsModal';
import { PrefectureExplorer } from './components/PrefectureExplorer';
import { RecentUpdates } from './components/RecentUpdates';
import { ReviewSystemModal } from './components/ReviewSystemModal';
import { AboutArchiveModal } from './components/AboutArchiveModal';
import { Footer } from './components/Footer';
import { normalizeSearchText, scoreSchool, scoreTeacher, sortByRelevance } from './utils/search';
import { V2Intro } from './components/V2Intro';
import { SchoolCompareModal } from './components/SchoolCompareModal';
import { BookOpen, Scale, X } from 'lucide-react';

export default function App() {
  // Archive Data States
  const [teachers, setTeachers] = useState<TeacherCandidate[]>(INITIAL_TEACHERS);
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [observations, setObservations] = useState<PersonnelObservation[]>(INITIAL_OBSERVATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [updates] = useState<RecentGazetteUpdate[]>(RECENT_UPDATES_DATA);

  // Search Filter State
  const [filters, setFilters] = useState<SearchFilterState>({
    query: '',
    searchType: 'all',
    prefecture: '',
    municipality: '',
    schoolType: '',
    fiscalYear: '',
    eventType: '',
  });

  // Modal Dialog States
  const initialParams = new URLSearchParams(window.location.search);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherCandidate | null>(() => INITIAL_TEACHERS.find((teacher) => teacher.id === initialParams.get('teacher')) || null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(() => INITIAL_SCHOOLS.find((school) => school.id === initialParams.get('school')) || null);
  const [selectedSource, setSelectedSource] = useState<OfficialSource | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [comparedSchoolIds, setComparedSchoolIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Refs for scrolling to sections
  const resultsRef = useRef<HTMLDivElement>(null);
  const prefectureRef = useRef<HTMLDivElement>(null);
  const updatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restoreRoute = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedTeacher(teachers.find((teacher) => teacher.id === params.get('teacher')) || null);
      setSelectedSchool(schools.find((school) => school.id === params.get('school')) || null);
    };
    window.addEventListener('popstate', restoreRoute);
    return () => window.removeEventListener('popstate', restoreRoute);
  }, [schools, teachers]);

  // 表記ゆれを吸収し、氏名・学校名を優先した関連度順で表示
  const filteredTeachers = useMemo(() => {
    const filtered = teachers.filter((teacher) => {
      // Prefecture filter
      if (filters.prefecture && teacher.prefecture !== filters.prefecture) {
        return false;
      }

      // Municipality filter
      if (
        filters.municipality &&
        !normalizeSearchText(teacher.municipality).includes(normalizeSearchText(filters.municipality))
      ) {
        return false;
      }

      // School type filter
      if (filters.schoolType && teacher.schoolType !== filters.schoolType) {
        return false;
      }

      // Fiscal year filter
      if (filters.fiscalYear) {
        const targetYear = parseInt(filters.fiscalYear, 10);
        const hasYearInTimeline = teacher.timeline.some((t) => t.fiscalYear === targetYear);
        if (teacher.latestFiscalYear !== targetYear && !hasYearInTimeline) {
          return false;
        }
      }

      // Event type filter
      if (filters.eventType) {
        const hasEventType = teacher.timeline.some((t) => t.eventType === filters.eventType);
        if (!hasEventType) {
          return false;
        }
      }

      return true;
    });
    return filters.query.trim()
      ? sortByRelevance(filtered, filters.query, scoreTeacher)
      : filtered;
  }, [teachers, filters]);

  // Filtered schools
  const filteredSchools = useMemo(() => {
    const filtered = schools.filter((school) => {
      // Prefecture filter
      if (filters.prefecture && school.prefecture !== filters.prefecture) {
        return false;
      }

      // Municipality filter
      if (
        filters.municipality &&
        !normalizeSearchText(school.municipality).includes(normalizeSearchText(filters.municipality))
      ) {
        return false;
      }

      // School type filter
      if (filters.schoolType && school.schoolType !== filters.schoolType) {
        return false;
      }

      // Fiscal year filter
      if (filters.fiscalYear) {
        const targetYear = parseInt(filters.fiscalYear, 10);
        const hasYear = school.personnelByYear.some((py) => py.fiscalYear === targetYear);
        if (school.latestConfirmedYear !== targetYear && !hasYear) {
          return false;
        }
      }

      return true;
    });
    return filters.query.trim()
      ? sortByRelevance(filtered, filters.query, scoreSchool)
      : filtered;
  }, [schools, filters]);

  // Sample autocomplete suggestions
  const sampleSuggestions = useMemo(() => {
    const list: { name: string; type: 'teacher' | 'school'; desc: string }[] = [];
    teachers.forEach((t) => {
      list.push({
        name: t.name,
        type: 'teacher',
        desc: `${t.prefecture} · ${t.currentSchoolName} (${t.currentPosition})`,
      });
    });
    schools.forEach((s) => {
      list.push({
        name: s.name,
        type: 'school',
        desc: `${s.prefecture} ${s.municipality} · ${s.schoolType}`,
      });
    });
    if (!filters.query.trim()) return list.slice(0, 40);
    const query = normalizeSearchText(filters.query);
    return list
      .map((item, index) => {
        const name = normalizeSearchText(item.name);
        const desc = normalizeSearchText(item.desc);
        const score = name === query ? 400 : name.startsWith(query) ? 220 : name.includes(query) ? 120 : desc.includes(query) ? 40 : 0;
        return { item, index, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 12)
      .map(({ item }) => item);
  }, [teachers, schools, filters.query]);

  // Handlers for selection & navigation
  const handleQuickSearch = (query: string, type: 'all' | 'teacher' | 'school' = 'all') => {
    setFilters({
      ...filters,
      query,
      searchType: type,
    });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openTeacher = (teacher: TeacherCandidate) => {
    setSelectedSchool(null);
    setSelectedTeacher(teacher);
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('teacher', teacher.id);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSchool = (school: School) => {
    setSelectedTeacher(null);
    setSelectedSchool(school);
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('school', school.id);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeDetailPage = () => {
    setSelectedTeacher(null);
    setSelectedSchool(null);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSchoolById = (schoolId: string) => {
    const school = schools.find((s) => s.id === schoolId);
    if (school) {
      openSchool(school);
    }
  };

  const handleSelectTeacherById = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher) {
      openTeacher(teacher);
    }
  };

  const handleSelectPrefecture = (pref: string) => {
    setFilters({
      ...filters,
      prefecture: pref,
    });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectUpdate = (update: RecentGazetteUpdate) => {
    const prefMatch = update.issuer.match(/([^\s/]+?(?:都|道|府|県))/);
    const pref = prefMatch ? prefMatch[1] : '';
    setFilters({
      ...filters,
      prefecture: pref,
      fiscalYear: update.fiscalYear.toString(),
    });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleCompare = (school: School) => {
    setComparedSchoolIds((current) =>
      current.includes(school.id)
        ? current.filter((id) => id !== school.id)
        : current.length < 3 ? [...current, school.id] : current
    );
  };

  const handleNavClick = (target: 'teachers' | 'schools' | 'updates' | 'regions' | 'about' | 'review') => {
    if (selectedTeacher || selectedSchool) closeDetailPage();
    if (target === 'teachers') {
      setFilters((prev) => ({ ...prev, searchType: 'teacher' }));
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'schools') {
      setFilters((prev) => ({ ...prev, searchType: 'school' }));
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'updates') {
      updatesRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'regions') {
      prefectureRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'about') {
      setIsAboutModalOpen(true);
    } else if (target === 'review') {
      setIsReviewModalOpen(true);
    }
  };

  // Review & Reversible Audit Handlers (Sections 21 & 22)
  const handleApproveObservation = (obsId: string) => {
    setObservations((prev) =>
      prev.map((o) =>
        o.id === obsId
          ? {
              ...o,
              reviewStatus: '承認済み',
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
              reviewerNotes: '人間レビュアーによる本人照合完了・承認発令。',
            }
          : o
      )
    );

    const obs = observations.find((o) => o.id === obsId);
    if (obs) {
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        action: '承認',
        targetType: 'observation',
        targetId: obs.id,
        targetName: `${obs.extractedName} (${obs.extractedNewOrg})`,
        details: `公報抽出レコード ${obs.id} の同一性確認を完了し、公開タイムラインへ承認反映しました。`,
        reversible: true,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  const handleSplitObservation = (obsId: string) => {
    const obs = observations.find((o) => o.id === obsId);
    if (!obs) return;

    setObservations((prev) =>
      prev.map((o) =>
        o.id === obsId
          ? {
              ...o,
              reviewStatus: '承認済み',
              assignedTeacherId: `tch-split-${Date.now()}`,
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
              reviewerNotes: '同姓同名の別候補として新規人物IDへ分離割当。',
            }
          : o
      )
    );

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action: '人物分離',
      targetType: 'observation',
      targetId: obs.id,
      targetName: `${obs.extractedName} (分離処理)`,
      details: `同姓同名候補との混同を防止するため、独立した人物IDへ分離しました。`,
      reversible: true,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleRejectObservation = (obsId: string) => {
    setObservations((prev) =>
      prev.map((o) =>
        o.id === obsId
          ? {
              ...o,
              reviewStatus: '却下',
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
              reviewerNotes: '公報抽出行の重複または不整合により非公開除外。',
            }
          : o
      )
    );

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action: '却下',
      targetType: 'observation',
      targetId: obsId,
      targetName: `観測レコード ${obsId}`,
      details: `公報抽出レコード ${obsId} を不整合のためアーカイブ対象から除外しました。`,
      reversible: true,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleRevertAuditLog = (logId: string) => {
    const log = auditLogs.find((l) => l.id === logId);
    if (!log) return;

    // Reset observation back to pending
    setObservations((prev) =>
      prev.map((o) =>
        o.id === log.targetId
          ? { ...o, reviewStatus: '確認中', reviewedAt: undefined, reviewerNotes: '監査ログ取消により要再照合' }
          : o
      )
    );

    const revertLog: AuditLogItem = {
      id: `log-revert-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action: 'データ修正',
      targetType: log.targetType,
      targetId: log.targetId,
      targetName: log.targetName,
      details: `直前の操作「${log.action}: ${log.details}」を取り消し、確認中ステータスへロールバックしました。`,
      reversible: false,
    };
    setAuditLogs((prev) => [revertLog, ...prev]);
  };

  return (
    <div className="v2-shell min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {showIntro && <V2Intro onComplete={() => setShowIntro(false)} />}
      <div className="v2-version-ribbon"><BookOpen className="h-3.5 w-3.5" /> THE OPEN INDEX / VERSION 2</div>
      {/* 1. Header */}
      <Header onNavClick={handleNavClick} />

      {selectedTeacher || selectedSchool ? (
        <ArchiveDetailPage
          teacher={selectedTeacher}
          school={selectedSchool}
          allTeachers={teachers}
          allSchools={schools}
          onBack={closeDetailPage}
          onSelectTeacher={openTeacher}
          onSelectSchool={openSchool}
          onOpenSource={setSelectedSource}
          onToggleCompare={handleToggleCompare}
          isCompared={Boolean(selectedSchool && comparedSchoolIds.includes(selectedSchool.id))}
        />
      ) : <>
      {/* 2. Hero Search Area */}
      <HeroSearch filters={filters} onFilterChange={setFilters} onQuickSearch={handleQuickSearch} sampleSuggestions={sampleSuggestions} />

      {/* 3. Main Results Section */}
      <main className="relative z-0 flex-1" ref={resultsRef}>
        <SearchResults
          teachers={filteredTeachers}
          schools={filteredSchools}
          filters={filters}
          onFilterChange={setFilters}
          onSelectTeacher={openTeacher}
          onSelectSchoolById={handleSelectSchoolById}
          onSelectSchool={openSchool}
          onToggleCompare={handleToggleCompare}
          comparedSchoolIds={comparedSchoolIds}
        />

        {/* 4. Prefecture Explorer Section */}
        <div ref={prefectureRef} id="regions">
          <PrefectureExplorer
            onSelectPrefecture={handleSelectPrefecture}
            schools={schools}
            teachers={teachers}
          />
        </div>

        {/* 5. Recent Gazette Updates Section */}
        <div ref={updatesRef} id="updates">
          <RecentUpdates
            updates={updates}
            onSelectUpdate={handleSelectUpdate}
          />
        </div>
      </main>
      </>}

      {/* 6. Footer */}
      <Footer onNavClick={handleNavClick} />

      {/* MODALS */}
      {/* Official Source Inspector Modal */}
      <SourceDetailsModal
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
      />

      {/* Review & Reversible Audit Console Modal (Sections 21 & 22) */}
      <ReviewSystemModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        observations={observations}
        auditLogs={auditLogs}
        onApproveObservation={handleApproveObservation}
        onSplitObservation={handleSplitObservation}
        onRejectObservation={handleRejectObservation}
        onRevertAuditLog={handleRevertAuditLog}
      />

      {/* About & Privacy Ethics Modal */}
      <AboutArchiveModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
      {comparedSchoolIds.length > 0 && (
        <div className="v2-compare-tray">
          <span><Scale className="h-4 w-4" /><b>{comparedSchoolIds.length}</b>校を比較中</span>
          <button onClick={() => setIsCompareOpen(true)} disabled={comparedSchoolIds.length < 2}>比較表を開く</button>
          <button onClick={() => setComparedSchoolIds([])} aria-label="比較をクリア"><X className="h-4 w-4" /></button>
        </div>
      )}
      {isCompareOpen && (
        <SchoolCompareModal
          schools={schools.filter((school) => comparedSchoolIds.includes(school.id))}
          onClose={() => setIsCompareOpen(false)}
          onRemove={(id) => setComparedSchoolIds((current) => current.filter((value) => value !== id))}
        />
      )}
    </div>
  );
}
