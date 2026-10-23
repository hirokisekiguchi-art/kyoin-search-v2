import React from 'react';
import { RecentGazetteUpdate } from '../types';
import { Calendar, FileCheck, ArrowRight, Building2, Newspaper } from 'lucide-react';

interface RecentUpdatesProps {
  updates: RecentGazetteUpdate[];
  onSelectUpdate: (update: RecentGazetteUpdate) => void;
}

export const RecentUpdates: React.FC<RecentUpdatesProps> = ({
  updates,
  onSelectUpdate,
}) => {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto" aria-label="公報更新情報">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1.5">
            <Newspaper className="w-4 h-4" />
            最近の人事異動・公報更新情報
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            教育委員会公式公報の最新収録状況
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            各都道府県・政令市教育委員会より定期告示された教職員異動記録のデータベース反映履歴です。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updates.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectUpdate(item)}
            className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-sm p-4.5 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-600" />
                  {item.issuer.split('/')[0].trim()}
                </span>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.updateDate}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item.recordsCount.toLocaleString()}件 照合済</span>
              </span>
              <span className="text-blue-600 group-hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px]">
                <span>この公報を見る</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
