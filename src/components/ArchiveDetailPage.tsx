import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowUpRight, BookOpen, Building2, Check, ExternalLink, FileText, History, MapPin, MessageSquare, Plus, ShieldCheck, User, Users } from 'lucide-react';
import { getSchoolGoogleMapsUrl, OFFICIAL_SOURCES_DATA } from '../data/archiveData';
import { OfficialSource, School, TeacherCandidate } from '../types';

interface ArchiveDetailPageProps {
  teacher: TeacherCandidate | null;
  school: School | null;
  allTeachers: TeacherCandidate[];
  allSchools: School[];
  onBack: () => void;
  onSelectTeacher: (teacher: TeacherCandidate) => void;
  onSelectSchool: (school: School) => void;
  onOpenSource: (source: OfficialSource) => void;
  onToggleCompare: (school: School) => void;
  isCompared: boolean;
}

export const ArchiveDetailPage: React.FC<ArchiveDetailPageProps> = ({ teacher, school, allTeachers, allSchools, onBack, onSelectTeacher, onSelectSchool, onOpenSource, onToggleCompare, isCompared }) => {
  const [year, setYear] = useState<number | null>(null);
  const currentSchool = teacher ? allSchools.find((candidate) => candidate.id === teacher.currentSchoolId) : undefined;
  const relatedTeachers = useMemo(() => teacher ? allTeachers.filter((candidate) => candidate.id !== teacher.id && candidate.currentSchoolId === teacher.currentSchoolId).slice(0, 8) : [], [allTeachers, teacher]);
  const homonyms = useMemo(() => teacher ? allTeachers.filter((candidate) => candidate.id !== teacher.id && candidate.name === teacher.name).slice(0, 6) : [], [allTeachers, teacher]);

  if (!teacher && !school) return null;

  if (teacher) {
    const timeline = [...teacher.timeline].sort((a, b) => b.fiscalYear - a.fiscalYear);
    return (
      <main className="v2-record-page">
        <nav className="v2-record-breadcrumb"><button onClick={onBack}>人事アーカイブ</button><span>／</span><span>先生</span><span>／</span><b>{teacher.name}</b></nav>
        <header className="v2-record-hero">
          <button className="v2-record-back" onClick={onBack}><ArrowLeft />索引へ戻る</button>
          <p>PERSONNEL INDEX / {teacher.latestFiscalYear}</p>
          <div className="v2-record-title"><span className="v2-record-monogram"><User /></span><div>{teacher.kana && <small>{teacher.kana}</small>}<h1>{teacher.name}</h1><p>{teacher.currentPosition}</p></div><span className={`v2-record-status ${teacher.verificationStatus === '確認済み' ? 'verified' : ''}`}><ShieldCheck />{teacher.verificationStatus}</span></div>
          <dl><div><dt>最新確認所属</dt><dd><button onClick={() => currentSchool && onSelectSchool(currentSchool)}>{teacher.currentSchoolName}<ArrowUpRight /></button></dd></div><div><dt>地域</dt><dd>{teacher.prefecture} {teacher.municipality}</dd></div><div><dt>最新年度</dt><dd>{teacher.latestFiscalYear}年度</dd></div><div><dt>収録記録</dt><dd>{teacher.timeline.length}件</dd></div></dl>
        </header>

        {(teacher.homonymCandidateCount || homonyms.length > 0) && <aside className="v2-record-warning"><AlertTriangle /><div><b>同姓同名の候補があります</b><p>{teacher.homonymNote || '所属・地域・役職を照合し、別人物候補として分けて表示しています。'}</p>{homonyms.length > 0 && <div>{homonyms.map((candidate, index) => <button key={`${candidate.id}-${index}`} onClick={() => onSelectTeacher(candidate)}>{candidate.prefecture}・{candidate.currentSchoolName}<ArrowUpRight /></button>)}</div>}</div></aside>}

        <div className="v2-record-layout">
          <aside className="v2-record-index"><p>ON THIS PAGE</p><a href="#career">01 経歴</a><a href="#related">02 同じ学校の先生</a><a href="#sources">03 出典</a></aside>
          <div className="v2-record-body">
            <section id="career" className="v2-record-section"><div className="v2-section-heading"><span>01</span><div><p>CAREER TIMELINE</p><h2>人事異動・所属経歴</h2></div></div><ol className="v2-career-list">{timeline.map((event, index) => <li key={`${event.id}-${index}`}><time>{event.fiscalYear}<small>年度</small></time><div className="v2-career-rule"><i /></div><article><div><span>{event.eventType}{event.isPromotion ? '・昇任' : ''}</span><small>{event.effectiveDate} 発令</small></div><h3><button onClick={() => { const target = allSchools.find((candidate) => candidate.id === event.schoolId); if (target) onSelectSchool(target); }}>{event.schoolName}<ArrowUpRight /></button></h3><p>{event.position}</p>{event.previousSchoolName && <p className="v2-career-from">前所属：{event.previousSchoolName} {event.previousPosition}</p>}{event.note && <p>{event.note}</p>}<button className="v2-source-link" onClick={() => onOpenSource(event.source)}><FileText />公報の該当箇所を見る</button></article></li>)}</ol></section>
            <section id="related" className="v2-record-section"><div className="v2-section-heading"><span>02</span><div><p>RELATED PEOPLE</p><h2>同じ学校で確認された先生</h2></div></div>{relatedTeachers.length ? <div className="v2-related-list">{relatedTeachers.map((candidate, index) => <button key={`${candidate.id}-${index}`} onClick={() => onSelectTeacher(candidate)}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{candidate.name}</b><small>{candidate.currentPosition}・{candidate.latestFiscalYear}年度</small></div><ArrowUpRight /></button>)}</div> : <p className="v2-record-empty">現在表示できる関連候補はありません。</p>}</section>
            <section id="sources" className="v2-record-section"><div className="v2-section-heading"><span>03</span><div><p>SOURCE POLICY</p><h2>典拠と掲載方針</h2></div></div><p className="v2-record-prose">教育委員会の人事異動公報・告示を年度別に記録しています。同姓同名は氏名だけで統合せず、所属・役職・異動履歴を候補単位で表示します。</p></section>
          </div>
        </div>
      </main>
    );
  }

  const target = school!;
  const activeYear = year ?? target.personnelByYear[0]?.fiscalYear ?? target.latestConfirmedYear;
  const roster = target.personnelByYear.find((item) => item.fiscalYear === activeYear);
  const rosterGroups = roster ? [
    { label: '転入', people: roster.transferredIn },
    { label: '転出', people: roster.transferredOut },
    { label: '新任', people: roster.newlyAppointed },
    { label: '退職', people: roster.retired },
  ] : [];
  const relatedSchools = allSchools.filter((candidate) => candidate.id !== target.id && candidate.prefecture === target.prefecture && candidate.municipality === target.municipality).slice(0, 6);

  return (
    <main className="v2-record-page">
      <nav className="v2-record-breadcrumb"><button onClick={onBack}>人事アーカイブ</button><span>／</span><span>学校</span><span>／</span><b>{target.name}</b></nav>
      <header className="v2-record-hero school">
        <button className="v2-record-back" onClick={onBack}><ArrowLeft />索引へ戻る</button><p>SCHOOL REGISTER / {target.latestConfirmedYear}</p>
        <div className="v2-record-title"><span className="v2-record-monogram"><Building2 /></span><div><small>{target.schoolType}・{target.founder}</small><h1>{target.name}</h1><p><MapPin />{target.prefecture} {target.municipality} {target.address}</p></div></div>
        <dl><div><dt>最新年度</dt><dd>{target.latestConfirmedYear}年度</dd></div><div><dt>人事記録</dt><dd>{target.totalConfirmedPersonnelCount}件</dd></div><div><dt>年度台帳</dt><dd>{target.personnelByYear.length}年分</dd></div><div><dt>学校沿革</dt><dd>{target.history.length}件</dd></div></dl>
        <div className="v2-record-actions"><button className={isCompared ? 'is-added' : ''} onClick={() => onToggleCompare(target)}>{isCompared ? <Check /> : <Plus />}{isCompared ? '比較に追加済み' : '学校を比較'}</button><a href={target.googleMapsUrl || getSchoolGoogleMapsUrl(target)} target="_blank" rel="noreferrer"><MessageSquare />Googleマップで口コミを見る<ExternalLink /></a></div>
      </header>
      <div className="v2-record-layout">
        <aside className="v2-record-index"><p>ON THIS PAGE</p><a href="#roster">01 人事台帳</a><a href="#history">02 学校沿革</a><a href="#nearby">03 同じ地域</a></aside>
        <div className="v2-record-body">
          <section id="roster" className="v2-record-section">
            <div className="v2-section-heading"><span>01</span><div><p>PERSONNEL REGISTER</p><h2>年度別人事台帳</h2></div></div>
            <div className="v2-year-tabs">{target.personnelByYear.map((item) => <button className={activeYear === item.fiscalYear ? 'is-active' : ''} key={item.fiscalYear} onClick={() => setYear(item.fiscalYear)}>{item.fiscalYear}年度</button>)}</div>
            {roster ? <>
              <div className="v2-leadership">
                <div><small>校長</small>{roster.principal ? <button onClick={() => { const person = allTeachers.find((candidate) => candidate.id === roster.principal!.teacherId); if (person) onSelectTeacher(person); }}>{roster.principal.name}<ArrowUpRight /></button> : <span>公報記載なし</span>}</div>
                <div><small>副校長・教頭</small>{roster.vicePrincipal ? <button onClick={() => { const person = allTeachers.find((candidate) => candidate.id === roster.vicePrincipal!.teacherId); if (person) onSelectTeacher(person); }}>{roster.vicePrincipal.name}<ArrowUpRight /></button> : <span>公報記載なし</span>}</div>
              </div>
              <div className="v2-roster-groups">{rosterGroups.map((group) => group.people.length > 0 && <div key={group.label}>
                <h3>{group.label}<span>{group.people.length}</span></h3>
                {group.people.map((person, index) => {
                  const place = 'fromSchool' in person ? String(person.fromSchool) : 'toSchool' in person ? String(person.toSchool) : person.eventType;
                  return <div className="v2-roster-row" key={`${person.teacherId}-${index}`}><button onClick={() => { const candidate = allTeachers.find((item) => item.id === person.teacherId); if (candidate) onSelectTeacher(candidate); }}>{person.name}<ArrowUpRight /></button><span>{person.position}</span><small>{place}</small>{OFFICIAL_SOURCES_DATA[person.sourceId] && <button onClick={() => onOpenSource(OFFICIAL_SOURCES_DATA[person.sourceId])}><FileText />出典</button>}</div>;
                })}
              </div>)}</div>
            </> : <p className="v2-record-empty">この年度の人事台帳はありません。</p>}
          </section>
          <section id="history" className="v2-record-section"><div className="v2-section-heading"><span>02</span><div><p>SCHOOL HISTORY</p><h2>学校沿革</h2></div></div>{target.history.length ? <ol className="v2-history-list">{target.history.map((item, index) => <li key={`${item.year}-${index}`}><time>{item.year}</time><span>{item.type}</span><div><p>{item.description}</p><small>{item.sourceNote}</small></div></li>)}</ol> : <p className="v2-record-empty">現在表示できる沿革記録はありません。</p>}</section>
          <section id="nearby" className="v2-record-section"><div className="v2-section-heading"><span>03</span><div><p>NEARBY INDEX</p><h2>{target.municipality}の学校</h2></div></div><div className="v2-related-list">{relatedSchools.map((candidate, index) => <button key={candidate.id} onClick={() => onSelectSchool(candidate)}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{candidate.name}</b><small>{candidate.schoolType}・人事{candidate.totalConfirmedPersonnelCount}件</small></div><ArrowUpRight /></button>)}</div></section>
        </div>
      </div>
    </main>
  );
};
