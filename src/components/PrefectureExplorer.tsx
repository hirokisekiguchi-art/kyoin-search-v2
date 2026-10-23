import React, { useState } from 'react';
import { REGIONS_DATA } from '../data/archiveData';
import { School, TeacherCandidate } from '../types';
import { MapPin, Building2, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

interface PrefectureExplorerProps {
  onSelectPrefecture: (prefecture: string) => void;
  schools: School[];
  teachers: TeacherCandidate[];
}

export const PrefectureExplorer: React.FC<PrefectureExplorerProps> = ({
  onSelectPrefecture,
  schools,
  teachers,
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('南関東 (先行公開)');

  // Compute school and teacher counts per prefecture
  const getPrefStats = (pref: string) => {
    const prefSchools = schools.filter((s) => s.prefecture === pref);
    const prefTeachers = teachers.filter((t) => t.prefecture === pref);
    return {
      schoolCount: prefSchools.length,
      teacherCount: prefTeachers.length,
      hasRecords: prefSchools.length > 0 || prefTeachers.length > 0,
    };
  };

  const currentRegionData = REGIONS_DATA.find((r) => r.name === activeRegion) || REGIONS_DATA[0];

  return (
    <section className="py-12 px-4 sm:px-6 bg-slate-100/70 border-t border-slate-200" aria-label="地域から探す">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              地域から探す · スモールスタート公開
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              公立学校・教育公報アーカイブ（南関東先行）
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              初期リリースとして南関東（東京・神奈川・埼玉・千葉）を重点公開中。都道府県を選択して学校・教職員の人事記録を絞り込めます。
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              南関東収集データ反映済み
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              他地域も順次拡張中
            </span>
          </div>
        </div>

        {/* Region Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {REGIONS_DATA.map((region) => (
            <button
              key={region.name}
              onClick={() => setActiveRegion(region.name)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeRegion === region.name
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <span>{region.name}</span>
              {region.isSmallStart && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  activeRegion === region.name ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  先行
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Prefectures in Active Region Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {currentRegionData.prefectures.map((pref) => {
            const stats = getPrefStats(pref);

            return (
              <button
                key={pref}
                onClick={() => onSelectPrefecture(pref)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  stats.hasRecords
                    ? 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
                    : 'bg-slate-50/80 border-slate-200/60 opacity-80 hover:opacity-100 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                      {pref}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all" />
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                    {stats.hasRecords ? (
                      <>
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>学校 {stats.schoolCount}校</span>
                        </div>
                        <div className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>人事記録あり</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-400 text-[10px]">
                        公報順次追加中
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
