import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavClick: (target: 'teachers' | 'schools' | 'updates' | 'regions' | 'about' | 'review') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="font-bold text-base tracking-tight">教員サーチ</div>
              <span className="text-slate-400 text-xs">公立学校人事アーカイブ</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.2 rounded">南関東先行</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              「あの先生、今どこにいるんだろう？」という疑問から、公立学校・教育機関の人事異動公報や学校の歩みを安全にたどれる公共データベースです。南関東スモールスタート公開中。
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>公式発表公報・告示のみを収録（口コミはGoogleマップへ安全連携）</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-semibold text-slate-200 mb-3 text-xs tracking-wider">
              アーカイブを探す
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavClick('teachers')}
                  className="hover:text-white transition-colors"
                >
                  先生を探す
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('schools')}
                  className="hover:text-white transition-colors"
                >
                  学校を探す
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('regions')}
                  className="hover:text-white transition-colors"
                >
                  地域・47都道府県から探す
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('updates')}
                  className="hover:text-white transition-colors"
                >
                  最新の公報更新・収録状況
                </button>
              </li>
            </ul>
          </div>

          {/* Archive Policies */}
          <div>
            <div className="font-semibold text-slate-200 mb-3 text-xs tracking-wider">
              運営・信頼性
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavClick('about')}
                  className="hover:text-white transition-colors"
                >
                  このサイトについて
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('about')}
                  className="hover:text-white transition-colors"
                >
                  プライバシー方針と掲載基準
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('about')}
                  className="hover:text-white transition-colors"
                >
                  照会・誤記訂正のお申し出
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('review')}
                  className="hover:text-white transition-colors"
                >
                  公報検証パイプライン・監査ログ
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 教員サーチ - 公立学校人事アーカイブ. All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            典拠: 各都道府県教育委員会公報・告示資料及び学校要覧公開情報
          </div>
        </div>
      </div>
    </footer>
  );
};
