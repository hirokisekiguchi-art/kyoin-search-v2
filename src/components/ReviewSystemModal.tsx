import React, { useState } from 'react';
import { PersonnelObservation, AuditLogItem } from '../types';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Split, 
  RotateCcw,
  Database,
  FileCheck2,
  Workflow
} from 'lucide-react';

interface ReviewSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: PersonnelObservation[];
  auditLogs: AuditLogItem[];
  onApproveObservation: (obsId: string) => void;
  onSplitObservation: (obsId: string) => void;
  onRejectObservation: (obsId: string) => void;
  onRevertAuditLog: (logId: string) => void;
}

export const ReviewSystemModal: React.FC<ReviewSystemModalProps> = ({
  isOpen,
  onClose,
  observations,
  auditLogs,
  onApproveObservation,
  onSplitObservation,
  onRejectObservation,
  onRevertAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'observations' | 'audit'>('pipeline');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-labelledby="review-system-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <h2 id="review-system-title" className="text-lg font-bold">
                公報収集・データ検証・監査システム
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              公式公報抽出行の「観測データ」と「本人同一性」を分離し、可逆的な審査と監査ログを担保します。
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            データ検証パイプライン（設計思想）
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'observations'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            観測データ・同一性レビュー ({observations.length}件)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'audit'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            可逆監査ログ ({auditLogs.length}件)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
                <div className="font-bold text-sm text-blue-950 mb-1 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  「公立学校人事アーカイブ」の信頼性を守る基本思想
                </div>
                「資料に氏名が記載されていた事実」と「その人物が特定の教員本人であること」は別個の事象です。
                氏名一致のみでの安易な自動名寄せや、未検証データの即時公開を行わず、
                公報抽出レコードを独立した観測データ（Observation）として管理し、慎重な同一性判定を経たもののみをタイムラインとして公開します。
              </div>

              {/* 6-step Flow */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-center text-xs">
                {[
                  { step: '1', title: '公式資料取得', desc: '教育委員会告示・公報PDF/Excel' },
                  { step: '2', title: '決定論的抽出', desc: '表構造・行セル抽出' },
                  { step: '3', title: '観測データ生成', desc: '未紐付けの生レコード' },
                  { step: '4', title: '同一性照合', desc: '地域・校種・教科・勤続照合' },
                  { step: '5', title: '承認・確定', desc: '人間審査・同姓同名分離' },
                  { step: '6', title: 'アーカイブ公開', desc: 'タイムラインへ反映' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-5 h-5 mx-auto mb-1.5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center">
                        {item.step}
                      </div>
                      <div className="font-bold text-slate-800 text-xs mb-1">
                        {item.title}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-800">厳格な同一人物判定ルール（ガイドライン）</div>
                <div>・<strong>氏名一致のみでの統合禁止：</strong> 全国・複数自治体に同姓同名の教員が多数存在するため、所属履歴、校種、担当教科、前任校の連続性が確認できない場合は自動統合しません。</div>
                <div>・<strong>可逆的修正：</strong> 誤統合や誤分離が発生した場合、いつでも元の観測データ状態に安全にロールバックできます。</div>
                <div>・<strong>透明性：</strong> すべての承認済み履歴は、発行元の教育委員会告示番号および電子ハッシュ値（SHA-256）に直接紐付けられています。</div>
              </div>
            </div>
          )}

          {activeTab === 'observations' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                公報から抽出された未承認・確認中・承認済みの観測データ一覧です。
              </div>

              <div className="space-y-3">
                {observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {obs.extractedName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                          {obs.extractedPosition}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {obs.extractedEventType}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          obs.reviewStatus === '承認済み'
                            ? 'bg-emerald-100 text-emerald-800'
                            : obs.reviewStatus === '確認中'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {obs.reviewStatus}
                      </span>
                    </div>

                    <div className="text-slate-600 mb-2">
                      <span>新所属: <strong className="text-slate-800">{obs.extractedNewOrg}</strong></span>
                      {obs.extractedOldOrg && (
                        <span className="ml-3">前所属: {obs.extractedOldOrg}</span>
                      )}
                    </div>

                    <div className="text-slate-500 text-[11px] mb-2 bg-slate-50 p-2 rounded">
                      典拠公報: {obs.sourceTitle} ({obs.fiscalYear}年度) · レビュー優先度スコア: {obs.confidenceScore}%
                      {obs.reviewerNotes && (
                        <div className="mt-1 text-slate-700 font-medium">
                          審査メモ: {obs.reviewerNotes}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      {obs.reviewStatus !== '承認済み' && (
                        <button
                          onClick={() => onApproveObservation(obs.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>本人確認・承認</span>
                        </button>
                      )}
                      <button
                        onClick={() => onSplitObservation(obs.id)}
                        className="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded font-medium flex items-center gap-1"
                      >
                        <Split className="w-3.5 h-3.5 text-amber-600" />
                        <span>別候補として分離</span>
                      </button>
                      {obs.reviewStatus !== '却下' && (
                        <button
                          onClick={() => onRejectObservation(obs.id)}
                          className="px-3 py-1 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded font-medium flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>却下・除外</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                データの追加・修正・人物統合・分離操作の完全な監査証跡です。可逆的なロールバック操作が可能です。
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 text-xs hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px]">
                          {log.action}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {log.targetName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-600 mb-2">
                      {log.details}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>対象ID: <code className="font-mono text-slate-600">{log.targetId}</code></span>
                      {log.reversible && (
                        <button
                          onClick={() => onRevertAuditLog(log.id)}
                          className="text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 underline"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>この操作を取り消す（Revert）</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            公的データ整合性保証プロトコル v1.4
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
