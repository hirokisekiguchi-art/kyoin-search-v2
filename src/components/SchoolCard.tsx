import React from 'react';
import { School } from '../types';
import { Building2, MapPin, History, ArrowRight, Landmark, ExternalLink, MessageSquare, Plus, Check } from 'lucide-react';
import { getSchoolGoogleMapsUrl, MINAMI_KANTO_PREFECTURES } from '../data/archiveData';

interface SchoolCardProps {
  school: School;
  onSelect: (school: School) => void;
  onToggleCompare?: (school: School) => void;
  isCompared?: boolean;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onSelect, onToggleCompare, isCompared }) => {
  const latestYearRoster = school.personnelByYear[0];
  const isMinamiKanto = MINAMI_KANTO_PREFECTURES.includes(school.prefecture) || school.isMinamiKantoPriority;
  const mapsUrl = school.googleMapsUrl || getSchoolGoogleMapsUrl(school);

  return (
    <div className="h-full bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 hover:-translate-y-0.5 hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Meta badges */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 flex-wrap">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
              {school.schoolType}
            </span>
            {isMinamiKanto && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70">
                南関東先行
              </span>
            )}
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {school.prefecture} {school.municipality}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {school.latestConfirmedYear}年度公報
          </span>
        </div>

        {/* School Name */}
        <div className="mb-2">
          <button onClick={() => onSelect(school)} className="text-left text-xl font-bold text-slate-900 decoration-2 underline-offset-4 group-hover:text-blue-700 group-hover:underline transition-colors">
            {school.name}
          </button>
          {school.formerNames && school.formerNames.length > 0 && (
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <History className="w-3 h-3 text-slate-400" />
              <span>旧称: {school.formerNames[0]}</span>
            </div>
          )}
        </div>

        {/* Founder */}
        <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-3">
          <Landmark className="w-3.5 h-3.5 text-slate-400" />
          <span>設置者: {school.founder}</span>
        </div>

        {/* Latest Personnel Summary */}
        {latestYearRoster && (
          <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 space-y-1">
            <div className="font-medium text-slate-700 flex items-center justify-between text-[11px]">
              <span>{latestYearRoster.fiscalYear}年度公報人事</span>
              <span className="text-slate-400">
                転入 {latestYearRoster.transferredIn.length}名 / 転出 {latestYearRoster.transferredOut.length}名
              </span>
            </div>
            {latestYearRoster.principal && (
              <div className="text-[11px] text-slate-500">
                校長: <span className="text-slate-700 font-medium">{latestYearRoster.principal.name}</span>
              </div>
            )}
            {latestYearRoster.vicePrincipal && (
              <div className="text-[11px] text-slate-500">
                教頭/副校長: <span className="text-slate-700 font-medium">{latestYearRoster.vicePrincipal.name}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        {onToggleCompare && (
          <button onClick={() => onToggleCompare(school)} className={`v2-compare-add ${isCompared ? 'is-added' : ''}`}>
            {isCompared ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {isCompared ? '比較に追加済み' : '学校を比較'}
          </button>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[11px] text-slate-500 hover:text-blue-700 flex items-center gap-1 bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-slate-200/70"
          title="Googleマップでこの学校の口コミ・評価を確認"
        >
          <MessageSquare className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
          <span>Googleマップで口コミを見る</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </a>

        <button
          onClick={() => onSelect(school)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn ml-auto"
        >
          <span>学校詳細・年度別人事</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
