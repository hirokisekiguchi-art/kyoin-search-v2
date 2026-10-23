import React, { useState } from 'react';
import { BookOpen, Info, MapPin, Menu, Newspaper, School, ShieldCheck, User, X } from 'lucide-react';

interface HeaderProps {
  onNavClick: (target: 'teachers' | 'schools' | 'updates' | 'regions' | 'about' | 'review') => void;
  activeNav?: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  const [open, setOpen] = useState(false);
  const go = (target: Parameters<HeaderProps['onNavClick']>[0]) => { onNavClick(target); setOpen(false); };
  const links = [
    { key: 'teachers' as const, label: '先生を探す', icon: User },
    { key: 'schools' as const, label: '学校を探す', icon: School },
    { key: 'updates' as const, label: '人事異動公報', icon: Newspaper },
    { key: 'regions' as const, label: '地域から探す', icon: MapPin },
    { key: 'about' as const, label: 'このサイトについて', icon: Info },
  ];
  return (
    <header className="v2-site-header">
      <button className="v2-brand" onClick={() => go('teachers')} aria-label="教員サーチホーム">
        <span className="v2-brand-mark"><BookOpen /></span>
        <span>教員サーチ<small>学校と人を、ひもとく。</small></span>
      </button>
      <nav className={open ? 'is-open' : ''} aria-label="メインナビゲーション">
        {links.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => go(key)}><Icon />{label}</button>)}
        <button className="v2-audit" onClick={() => go('review')}><ShieldCheck />データ検証・監査</button>
      </nav>
      <span className="v2-live-label"><span /> SOUTH KANTO / LIVE DATA</span>
      <button className="v2-menu" onClick={() => setOpen(!open)} aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}>{open ? <X /> : <Menu />}</button>
    </header>
  );
};
