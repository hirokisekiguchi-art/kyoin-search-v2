import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowRight, BookOpen, Building2, Check, ChevronUp, Clock3, FileCheck2,
  GraduationCap, MapPin, Plus, ShieldCheck, UserRound,
} from 'lucide-react';
import { OFFICIAL_SOURCES_DATA, REGIONS_DATA } from '../data/archiveData';
import type { OfficialSource, RecentGazetteUpdate, School, TeacherCandidate } from '../types';

type NavTarget = 'teachers' | 'schools' | 'updates' | 'regions' | 'about' | 'review';

interface ArchiveBottomProps {
  schools: School[];
  teachers: TeacherCandidate[];
  updates: RecentGazetteUpdate[];
  onSelectPrefecture: (prefecture: string) => void;
  onSelectUpdate: (update: RecentGazetteUpdate) => void;
  onOpenSource: (source: OfficialSource) => void;
  onSelectTeacher: (teacher: TeacherCandidate) => void;
  onNavClick: (target: NavTarget) => void;
}

const sources = Object.values(OFFICIAL_SOURCES_DATA);

const prefectureFromUpdate = (update: RecentGazetteUpdate) =>
  update.issuer.match(/([^\s/]+?(?:都|道|府|県))/)?.[1] || '';

const sourceForUpdate = (update: RecentGazetteUpdate) =>
  sources.find((source) =>
    source.fiscalYear === update.fiscalYear &&
    (update.issuer.includes(source.issuer) || source.issuer.includes(update.issuer.split('/')[0].trim())),
  );

export const ArchiveBottom: React.FC<ArchiveBottomProps> = ({
  schools, teachers, updates, onSelectPrefecture, onSelectUpdate, onOpenSource,
  onSelectTeacher, onNavClick,
}) => {
  const [activeRegion, setActiveRegion] = useState(REGIONS_DATA[0].name);
  const [feedFilter, setFeedFilter] = useState<'すべて' | '照合済み' | '新着'>('すべて');
  const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeRegionData = REGIONS_DATA.find((region) => region.name === activeRegion) || REGIONS_DATA[0];
  const publishedPrefectures = new Set([
    ...schools.map((school) => school.prefecture),
    ...teachers.map((teacher) => teacher.prefecture),
  ]);
  const checkedRecords = updates
    .filter((update) => update.status === '公式照合完了')
    .reduce((sum, update) => sum + update.recordsCount, 0);
  const visibleUpdates = useMemo(() => updates
    .filter((update) => feedFilter === 'すべて' ||
      (feedFilter === '照合済み' ? update.status === '公式照合完了' : update.status === '新着更新'))
    .sort((a, b) => b.updateDate.localeCompare(a.updateDate)), [feedFilter, updates]);

  const jumpToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegionKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % REGIONS_DATA.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + REGIONS_DATA.length) % REGIONS_DATA.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = REGIONS_DATA.length - 1;
    setActiveRegion(REGIONS_DATA[next].name);
    tabRefs.current[next]?.focus();
  };

  return <>
    <div className="archive-bottom">
      <nav className="archive-bottom-map" aria-label="探索のステップ">
        <span>THE ARCHIVE CONTINUES</span>
        <a href="#regions"><b>02</b>地域をめくる</a><i />
        <a href="#updates"><b>03</b>記録をたしかめる</a><i />
        <a href="#archive-footer"><b>04</b>この索引室のこと</a>
      </nav>

      <section className="archive-editorial-section archive-regions" id="regions" aria-labelledby="region-title">
        <aside className="archive-editorial-aside">
          <div className="archive-chapter"><strong>02</strong><span>REGIONAL EXPLORER<small>地域別アーカイブ</small></span></div>
          <h2 id="region-title">ひとつの地域から、<br />学校と人を、<br /><em>ひもとく。</em></h2>
          <p>公立学校・教育公報アーカイブ。<br />まずは南関東から、少しずつ全国へ。<br />地名を手がかりに記録を探せます。</p>
          <div className="archive-coverage"><strong>{String(publishedPrefectures.size).padStart(2, '0')}</strong><span>/ 47</span><small>収録データのある都道府県</small><div>{Array.from({ length: 47 }, (_, i) => <i className={i < publishedPrefectures.size ? 'is-filled' : ''} key={i} />)}</div></div>
        </aside>

        <div className="archive-section-content">
          <div className="archive-release-note"><MapPin /><div><strong>南関東から、アーカイブをひらいています。</strong><p>東京・神奈川・埼玉・千葉を重点公開地域として収録中です。</p></div><span>南関東先行<small>LIVE ARCHIVE</small></span></div>
          <div className="archive-region-tabs" role="tablist" aria-label="地方を選ぶ">
            {REGIONS_DATA.map((region, index) => <button
              key={region.name} ref={(node) => { tabRefs.current[index] = node; }} role="tab"
              aria-selected={activeRegion === region.name} tabIndex={activeRegion === region.name ? 0 : -1}
              onKeyDown={(event) => handleRegionKey(event, index)} onClick={() => setActiveRegion(region.name)}
            >{region.name}{region.isSmallStart && <i />}</button>)}
          </div>
          <div className="archive-region-meta"><h3>{activeRegionData.name}<span>{activeRegionData.prefectures.length} PREFECTURES</span></h3><span><i />収録あり <i />順次拡張</span></div>
          <div className="archive-prefecture-grid" role="tabpanel">
            {activeRegionData.prefectures.map((prefecture, index) => {
              const schoolCount = schools.filter((school) => school.prefecture === prefecture).length;
              const teacherCount = teachers.filter((teacher) => teacher.prefecture === prefecture).length;
              const available = schoolCount + teacherCount > 0;
              return <button key={prefecture} className={available ? 'is-available' : ''} onClick={() => onSelectPrefecture(prefecture)}>
                <span>AREA / {String(index + 1).padStart(2, '0')}<ArrowRight /></span>
                <h4>{prefecture}</h4>
                <div><strong>{schoolCount.toLocaleString()}</strong><span>収録学校<small>校 / ARCHIVE</small></span></div>
                <footer><i />{available ? `人事記録 ${teacherCount.toLocaleString()}件` : '公報順次追加中'}<span>探す <ArrowRight /></span></footer>
              </button>;
            })}
          </div>
          <div className="archive-region-guide"><ShieldCheck /><strong>収録状況を、見えるかたちに。</strong><p>都道府県を選ぶと学校・先生を一覧表示し、市区町村・学校種でも絞り込めます。</p></div>
        </div>
      </section>

      <section className="archive-editorial-section archive-updates" id="updates" aria-labelledby="updates-title">
        <aside className="archive-editorial-aside">
          <div className="archive-chapter"><strong>03</strong><span>GAZETTE JOURNAL<small>公報更新・収録状況</small></span></div>
          <h2 id="updates-title">新しい記録に、<br /><em>確かな典拠を。</em></h2>
          <p>教育委員会公式公報の最新収録状況。<br />いつ、どの資料から、何件を。<br />記録の背景までたどれる更新台帳です。</p>
          <div className="archive-feed-total"><div><span>収録公報</span><strong>{String(updates.length).padStart(2, '0')}<small>資料</small></strong></div><div><span>照合済み</span><strong>{checkedRecords.toLocaleString()}<small>レコード</small></strong></div></div>
        </aside>
        <div className="archive-section-content">
          <header className="archive-feed-heading"><div><span>LATEST ENTRIES</span><h3>公報収録の、新しいページ。</h3></div><strong>{visibleUpdates.length}<small> / {updates.length} 資料</small></strong></header>
          <div className="archive-feed-controls"><div>{(['すべて', '照合済み', '新着'] as const).map((filter) => <button key={filter} aria-pressed={feedFilter === filter} onClick={() => { setFeedFilter(filter); setExpandedUpdateId(null); }}>{filter}{filter === 'すべて' && <span>{updates.length}</span>}</button>)}</div><span><Clock3 />更新日が新しい順</span></div>
          <div className="archive-journal-list">
            {visibleUpdates.slice(0, showAllUpdates ? undefined : 3).map((update) => {
              const source = sourceForUpdate(update);
              const related = source ? teachers.filter((teacher) => teacher.timeline.some((event) => event.source.id === source.id)) : [];
              const expanded = expandedUpdateId === update.id;
              return <article className="archive-journal" key={update.id}>
                <div className="archive-journal-main"><time><small>{update.updateDate.slice(0, 4)}</small><strong>{update.updateDate.slice(5).replace('-', '/')}</strong><span>UPDATED</span></time><div>
                  <div className="archive-journal-tags"><span>{update.issuer.split('/')[0].trim()}</span><span>{update.fiscalYear}年度</span></div>
                  <button className="archive-journal-title" onClick={() => source ? onOpenSource(source) : onSelectUpdate(update)}>{update.title}<ArrowRight /></button>
                  <p>{update.description}</p>
                  <div className="archive-journal-status"><span className={update.status === '公式照合完了' ? 'is-checked' : ''}>{update.status === '公式照合完了' ? <Check /> : <Clock3 />}{update.status}</span><span><strong>{update.recordsCount.toLocaleString()}</strong> 件</span></div>
                </div></div>
                <div className="archive-journal-actions"><button onClick={() => setExpandedUpdateId(expanded ? null : update.id)} aria-expanded={expanded}><BookOpen />{expanded ? '収録記録を閉じる' : '収録記録を見る'}{expanded ? <ChevronUp /> : <Plus />}</button><button onClick={() => onSelectUpdate(update)}>{prefectureFromUpdate(update)}・{update.fiscalYear}年度で探す <ArrowRight /></button><button onClick={() => source ? onOpenSource(source) : onSelectUpdate(update)}><FileCheck2 />この公報を見る <ArrowRight /></button></div>
                {expanded && <div className="archive-related-records"><header><span>この公報に関連する人事記録</span><small>{related.length}件</small></header>{related.length ? related.map((teacher) => <button key={teacher.id} onClick={() => onSelectTeacher(teacher)}><UserRound /><span><strong>{teacher.name}</strong><small>{teacher.currentPosition} / {teacher.currentSchoolName}</small></span><ArrowRight /></button>) : <p>個別記録は都道府県・年度検索から確認できます。</p>}</div>}
              </article>;
            })}
          </div>
          {visibleUpdates.length > 3 && !showAllUpdates && <button className="archive-more-updates" onClick={() => setShowAllUpdates(true)}>以前の収録状況も見る <Plus /></button>}
          <div className="archive-feed-note"><ShieldCheck /><p>「収録」と「照合完了」を分けて表示しています。<br />公報の詳細では発行機関・該当箇所・原文・検証情報を確認できます。</p></div>
        </div>
      </section>
      <div className="archive-promise"><span>OUR EDITORIAL PROMISE</span><p>情報の向こうに、人がいる。<strong>だから、一つひとつの記録をていねいに。</strong></p><button onClick={() => onNavClick('about')}>掲載基準を読む <ArrowRight /></button></div>
    </div>

    <footer className="archive-footer" id="archive-footer">
      <div className="archive-footer-inner">
        <div className="archive-footer-top"><span>04 / ABOUT THIS ARCHIVE</span><button onClick={jumpToTop}>ページのはじまりへ <i>↑</i></button></div>
        <div className="archive-footer-grid">
          <div className="archive-footer-service"><button className="archive-footer-brand" onClick={jumpToTop}><span><GraduationCap /></span><strong>教員サーチ<small>公立学校人事アーカイブ</small></strong></button><b><i />南関東先行公開 <span>LIVE ARCHIVE</span></b><p>「あの先生、今どこにいるんだろう？」という疑問から、公立学校・教育機関の人事異動公報や学校の歩みを安全にたどれる公共データベースです。</p><div><ShieldCheck /><span>公式発表公報・告示を典拠に収録。<br />口コミはGoogleマップへ安全に外部連携します。</span></div></div>
          <nav aria-label="アーカイブを探す"><span>01 — EXPLORE</span><h3>アーカイブを探す</h3>{[['teachers','先生を探す'],['schools','学校を探す'],['regions','地域・47都道府県から探す'],['updates','最新の公報更新・収録状況']].map(([target,label]) => <button key={target} onClick={() => onNavClick(target as NavTarget)}>{label}<ArrowRight /></button>)}</nav>
          <nav aria-label="運営・信頼性"><span>02 — OUR PROMISE</span><h3>運営・信頼性</h3>{[['about','このサイトについて'],['about','プライバシー方針と掲載基準'],['about','照会・誤記訂正のお申し出'],['review','公報検証パイプライン・監査ログ']].map(([target,label], index) => <button key={`${target}-${index}`} onClick={() => onNavClick(target as NavTarget)}>{label}<ArrowRight /></button>)}</nav>
        </div>
        <div className="archive-footer-colophon"><span><BookOpen />典拠について</span><p>各都道府県教育委員会の公式公報・告示、学校要覧などの公開資料を典拠としています。</p><b>OPEN DATA,<br />CAREFULLY INDEXED.</b></div>
        <div className="archive-footer-bottom"><small>© 2026 教員サーチ - 公立学校人事アーカイブ</small><span>記録を、次の人へ。</span><small>SOUTH KANTO / LIVE DATA</small></div>
      </div>
    </footer>
  </>;
};
