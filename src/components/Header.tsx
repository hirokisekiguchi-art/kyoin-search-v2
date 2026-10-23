import React, { useState } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Search, 
  MapPin, 
  Info, 
  ShieldCheck, 
  Building2, 
  User, 
  Newspaper 
} from 'lucide-react';

interface HeaderProps {
  onNavClick: (target: 'teachers' | 'schools' | 'updates' | 'regions' | 'about' | 'review') => void;
  activeNav?: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick, activeNav }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (target: 'teachers' | 'schools' | 'updates' | 'regions' | 'about' | 'review') => {
    onNavClick(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => handleNav('teachers')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleNav('teachers');
          }}
          aria-label="教員サーチ ホームへ"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                教員サーチ
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                南関東先行公開
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-500 tracking-wider">
              公立学校人事アーカイブ
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600" aria-label="メインナビゲーション">
          <button
            onClick={() => handleNav('teachers')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeNav === 'teachers' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>先生を探す</span>
          </button>

          <button
            onClick={() => handleNav('schools')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeNav === 'schools' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>学校を探す</span>
          </button>

          <button
            onClick={() => handleNav('updates')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeNav === 'updates' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Newspaper className="w-4 h-4 text-slate-400" />
            <span>人事異動公報</span>
          </button>

          <button
            onClick={() => handleNav('regions')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeNav === 'regions' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>地域から探す</span>
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeNav === 'about' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>このサイトについて</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Review Console Trigger */}
          <button
            onClick={() => handleNav('review')}
            className="px-2.5 py-1.5 text-xs rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 border border-slate-200"
            title="公報収集パイプラインと監査ログ"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>データ検証・監査</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNav('teachers')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span>先生を探す</span>
          </button>
          <button
            onClick={() => handleNav('schools')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>学校を探す</span>
          </button>
          <button
            onClick={() => handleNav('updates')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <Newspaper className="w-4 h-4 text-indigo-600" />
            <span>人事異動公報（最新収録）</span>
          </button>
          <button
            onClick={() => handleNav('regions')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>地域から探す（47都道府県）</span>
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
          >
            <Info className="w-4 h-4 text-slate-500" />
            <span>このサイトについて・プライバシー方針</span>
          </button>
          <button
            onClick={() => handleNav('review')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2.5"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>公報データ検証・監査システム</span>
          </button>
        </div>
      )}
    </header>
  );
};
