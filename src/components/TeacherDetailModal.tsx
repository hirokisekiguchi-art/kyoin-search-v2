import React, { useState } from 'react';
import { TeacherCandidate, OfficialSource, CareerEvent } from '../types';
import { 
  X, 
  MapPin, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  ArrowUpRight,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface TeacherDetailModalProps {
  teacher: TeacherCandidate | null;
  onClose: () => void;
  onSelectSchool: (schoolId: string) => void;
  onSelectTeacherById: (teacherId: string) => void;
  onOpenSource: (source: OfficialSource) => void;
  allTeachers: TeacherCandidate[];
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  teacher,
  onClose,
  onSelectSchool,
  onSelectTeacherById,
  onOpenSource,
  allTeachers,
}) => {
  const [orderDesc, setOrderDesc] = useState<boolean>(true);

  if (!teacher) return null;
  const isVerified = teacher.verificationStatus === '確認済み';

  // Find other homonym candidates if any
  const homonyms = allTeachers.filter(
    (t) => t.name === teacher.name && t.id !== teacher.id
  );
  const relatedTeachers = allTeachers
    .filter((candidate) => candidate.id !== teacher.id && candidate.currentSchoolId === teacher.currentSchoolId)
    .slice(0, 6);

  const sortedTimeline = [...teacher.timeline].sort((a, b) =>
    orderDesc ? b.fiscalYear - a.fiscalYear : a.fiscalYear - b.fiscalYear
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-labelledby="teacher-modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-blue-50/50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              {teacher.kana && (
                <div className="text-xs font-medium text-slate-500 mb-0.5">
                  {teacher.kana}
                </div>
              )}
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 id="teacher-modal-title" className="text-2xl font-bold text-slate-900 tracking-tight">
                  {teacher.name}
                </h2>
                <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60">
                  {teacher.currentPosition}
                </span>
                <span className={`text-xs flex items-center gap-1 ${isVerified ? 'text-slate-500' : 'text-amber-700'}`}>
                  {isVerified ? <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {isVerified ? '公報照合・確認済み' : '収集済み・未照合候補'}
                </span>
              </div>

              {/* Current Organization */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-sm text-slate-700">
                <span className="text-xs text-slate-500">最新確認所属：</span>
                <button
                  onClick={() => onSelectSchool(teacher.currentSchoolId)}
                  className="font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 group"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>{teacher.currentSchoolName}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1 text-slate-600 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {teacher.prefecture} {teacher.municipality}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500">
                  最新確認：{teacher.latestFiscalYear}年度公報
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Homonym Disclaimer & Switcher */}
          {teacher.homonymCandidateCount && teacher.homonymCandidateCount > 0 && (
            <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-800">
                    同姓同名の別候補に関する注意事項
                  </div>
                  <div className="mt-0.5 text-amber-800/90">
                    {teacher.homonymNote || '同姓同名の別候補が存在するため、公立学校公報記載の地域・校種・経歴に基づいて別人物として分離しています。'}
                  </div>
                  {homonyms.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center gap-2 flex-wrap">
                      <span className="text-amber-800 font-medium">同姓同名の別候補を見る:</span>
                      {homonyms.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => onSelectTeacherById(h.id)}
                          className="px-2 py-1 bg-white border border-amber-300 rounded text-amber-900 font-medium hover:bg-amber-100 transition-colors inline-flex items-center gap-1"
                        >
                          <span>{h.prefecture} ({h.currentSchoolName} · {h.currentPosition})</span>
                          <ArrowUpRight className="w-3 h-3 text-amber-700" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Body: Timeline */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-800 text-sm">
                公立学校 人事異動・在籍タイムライン
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setOrderDesc(true)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  orderDesc ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-800'
                }`}
              >
                現在から過去順
              </button>
              <button
                onClick={() => setOrderDesc(false)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  !orderDesc ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-800'
                }`}
              >
                過去から現在順
              </button>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {sortedTimeline.map((item: CareerEvent, idx: number) => {
              const isLatest = idx === 0 && orderDesc;

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isLatest
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white group-hover:border-blue-400'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isLatest ? 'bg-white' : 'bg-slate-400'
                      }`}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-4 transition-all">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {item.fiscalYear}年度
                        </span>
                        <span className="text-xs text-slate-500">
                          （発令日: {item.effectiveDate}）
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 border border-blue-200/60">
                          【{item.eventType}{item.isPromotion ? '・昇任' : ''}】
                        </span>
                      </div>
                    </div>

                    <div className="text-base font-semibold text-slate-800 mt-1">
                      <button
                        onClick={() => onSelectSchool(item.schoolId)}
                        className="text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{item.schoolName}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="ml-2 text-slate-700 font-medium">
                        {item.position}
                      </span>
                    </div>

                    {item.previousSchoolName && (
                      <div className="text-xs text-slate-600 mt-2 bg-white/80 p-2 rounded border border-slate-200/60">
                        <span className="text-slate-400 font-medium">異動経緯：</span>
                        <span>
                          {item.previousSchoolName}（{item.previousPosition || '前職'}）
                          → {item.schoolName}（{item.position}）
                        </span>
                      </div>
                    )}

                    {item.note && (
                      <div className="text-xs text-slate-500 mt-2">
                        {item.note}
                      </div>
                    )}

                    {/* Source Link */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div className="text-slate-500 truncate max-w-[280px] sm:max-w-md">
                        {item.source.issuer} · {item.source.documentTitle}
                      </div>
                      <button
                        onClick={() => onOpenSource(item.source)}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1 shrink-0 ml-2"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>情報源を見る</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {relatedTeachers.length > 0 && (
            <section className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-4" aria-labelledby="related-teachers-title">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h3 id="related-teachers-title" className="text-sm font-semibold text-slate-800">同じ学校の関連記録</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{teacher.currentSchoolName}の最新確認記録から表示</p>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-white/80 border border-blue-200 rounded-full px-2 py-1">RELATED</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedTeachers.map((candidate) => (
                  <button key={candidate.id} onClick={() => onSelectTeacherById(candidate.id)} className="group flex items-center justify-between gap-2 rounded-lg border border-white/80 bg-white/80 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow">
                    <span>
                      <span className="block text-sm font-semibold text-blue-700 group-hover:underline">{candidate.name}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">{candidate.currentPosition} · {candidate.latestFiscalYear}年度</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-blue-400" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Privacy & Public Notice */}
          <div className="p-4 bg-slate-100/70 rounded-xl text-xs text-slate-500 leading-relaxed border border-slate-200">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              公立学校人事アーカイブの掲載基準とプライバシー保護
            </div>
            <div>
              本サービスは各自治体・教育委員会が公表した人事異動公報および告示の記録のみを体系的に整理しています。個人の私的な電話番号、現住所、メールアドレス、私生活、口コミ・評判等は一切保持・掲載していません。
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            人物ID: <span className="font-mono">{teacher.id}</span>
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
