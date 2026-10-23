import React from 'react';
import { OfficialSource } from '../types';
import { X, ExternalLink, ShieldCheck, FileText, Hash, Calendar, Building2 } from 'lucide-react';

interface SourceDetailsModalProps {
  source: OfficialSource | null;
  onClose: () => void;
}

export const SourceDetailsModal: React.FC<SourceDetailsModalProps> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="source-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 id="source-dialog-title" className="text-base font-semibold text-slate-800">
              公式公報・情報源の確認
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              発行機関 / 発表自治体
            </div>
            <div className="font-semibold text-slate-800 text-base">
              {source.issuer}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              公式資料名
            </div>
            <div className="text-slate-800 font-medium">
              {source.documentTitle}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-100">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                公開日・公報日付
              </div>
              <div className="text-slate-700">
                {source.publishedAt}（{source.fiscalYear}年度）
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-0.5">
                該当ページ / 告示番号
              </div>
              <div className="text-slate-700">
                {source.pageOrSheet} {source.rowOrLine ? `· ${source.rowOrLine}` : ''}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1">
              公報原文記録（抽出ログ）
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-700 break-all leading-relaxed">
              {source.rawRecordText}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              SHA-256 電子ダイジェスト（改ざん防止検証値）
            </div>
            <div className="font-mono text-[11px] text-slate-500 bg-slate-100 p-2 rounded break-all select-all">
              {source.sourceDigestSha256}
            </div>
          </div>

          {source.officialUrl && (
            <div className="pt-2">
              <a
                href={source.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>発行元公式アーカイブページを確認（外部公報）</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
