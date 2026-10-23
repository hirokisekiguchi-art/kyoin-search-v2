import React, { useState } from 'react';
import { School, OfficialSource } from '../types';
import { 
  X, 
  MapPin, 
  Building2, 
  Calendar, 
  History, 
  Users, 
  ArrowRight, 
  FileText,
  Landmark,
  BadgeAlert,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { OFFICIAL_SOURCES_DATA, getSchoolGoogleMapsUrl, MINAMI_KANTO_PREFECTURES } from '../data/archiveData';

interface SchoolDetailModalProps {
  school: School | null;
  onClose: () => void;
  onSelectTeacher: (teacherId: string) => void;
  onOpenSource: (source: OfficialSource) => void;
}

export const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({
  school,
  onClose,
  onSelectTeacher,
  onOpenSource,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  if (!school) return null;

  const hasUnverifiedPersonnel = school.personnelByYear.some((year) =>
    [...year.transferredIn, ...year.transferredOut, ...year.newlyAppointed, ...year.retired]
      .some((item) => OFFICIAL_SOURCES_DATA[item.sourceId]?.sourceDigestSha256 === '未照合')
  );

  // Set default selected year to latest available year
  const activeYear = selectedYear ?? (school.personnelByYear[0]?.fiscalYear || school.latestConfirmedYear);
  const currentYearPersonnel = school.personnelByYear.find((p) => p.fiscalYear === activeYear);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-labelledby="school-modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-blue-50/50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200/60">
                  {school.schoolType}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-slate-400" />
                  設置者: {school.founder}
                </span>
              </div>
              <h2 id="school-modal-title" className="text-2xl font-bold text-slate-900 tracking-tight">
                {school.name}
              </h2>
              {school.formerNames && school.formerNames.length > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  旧名称・別名：{school.formerNames.join(', ')}
                </div>
              )}
              <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {school.prefecture} {school.municipality} {school.address ? `(${school.address})` : ''}
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {hasUnverifiedPersonnel ? '収集人事記録延べ' : '確認教職員延べ'}: {school.totalConfirmedPersonnelCount}名
                </span>
                <span className="text-slate-300">|</span>
                <span>{hasUnverifiedPersonnel ? '最新収集年度' : '最新公報確認'}: {school.latestConfirmedYear}年度</span>
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
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Google Maps Word-of-Mouth (口コミ) & Location Section */}
          <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-emerald-50/50 rounded-xl p-4 border border-blue-200/90 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                  <div className="p-1 rounded bg-blue-600 text-white">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-blue-950">Googleマップの口コミ・学校レビュー</span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300/60">
                    安全な外部連携
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  当サイトでは公的な人事記録の信頼性と安全性を重視し、サイト内での独自口コミ投稿ではなく、Googleマップの公開レビュー機能へ誘導する安全運用を採用しています。
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <a
                  href={school.googleMapsUrl || getSchoolGoogleMapsUrl(school)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Googleマップで口コミ・評価を見る</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href={school.googleMapsUrl || getSchoolGoogleMapsUrl(school)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>周辺地図</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* School Institutional History */}
          {school.history && school.history.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2.5">
                <History className="w-4 h-4 text-blue-600" />
                学校沿革・改称・統合等の公式履歴
              </div>
              <div className="space-y-2">
                {school.history.map((h, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                      {h.year}年
                    </span>
                    <span className="font-medium text-blue-800 shrink-0">
                      【{h.type}】
                    </span>
                    <span className="text-slate-700">
                      {h.description}
                      <span className="text-slate-400 ml-1.5 font-normal">
                        （典拠: {h.sourceNote}）
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personnel by Year Section */}
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                年度別 人事異動・在籍教職員名簿
              </h3>

              {/* Fiscal Year Selector */}
              {school.personnelByYear.length > 1 && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                  {school.personnelByYear.map((p) => (
                    <button
                      key={p.fiscalYear}
                      onClick={() => setSelectedYear(p.fiscalYear)}
                      className={`px-3 py-1 rounded font-medium transition-colors ${
                        activeYear === p.fiscalYear
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p.fiscalYear}年度
                    </button>
                  ))}
                </div>
              )}
            </div>

            {currentYearPersonnel ? (
              <div className="space-y-4">
                {/* Principals / Management */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium mb-1">
                      校長（{activeYear}年度）
                    </div>
                    {currentYearPersonnel.principal ? (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onSelectTeacher(currentYearPersonnel.principal!.teacherId)}
                          className="font-semibold text-blue-700 hover:text-blue-900 hover:underline text-sm"
                        >
                          {currentYearPersonnel.principal.name}
                        </button>
                        <span className="text-xs text-slate-400">
                          {currentYearPersonnel.principal.effectiveYear}年度就任
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">公報未記載または変更なし</span>
                    )}
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium mb-1">
                      副校長 / 教頭（{activeYear}年度）
                    </div>
                    {currentYearPersonnel.vicePrincipal ? (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onSelectTeacher(currentYearPersonnel.vicePrincipal!.teacherId)}
                          className="font-semibold text-blue-700 hover:text-blue-900 hover:underline text-sm"
                        >
                          {currentYearPersonnel.vicePrincipal.name}
                        </button>
                        <span className="text-xs text-slate-400">
                          {currentYearPersonnel.vicePrincipal.effectiveYear}年度就任
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">公報未記載または変更なし</span>
                    )}
                  </div>
                </div>

                {/* Transferred In */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
                    <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                      <span>転入教職員 ({currentYearPersonnel.transferredIn.length}名)</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium">他校等から当校へ着任</span>
                  </div>

                  {currentYearPersonnel.transferredIn.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {currentYearPersonnel.transferredIn.map((t, idx) => (
                        <div key={idx} className="p-3.5 hover:bg-slate-50/70 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <button
                              onClick={() => onSelectTeacher(t.teacherId)}
                              className="font-semibold text-blue-700 hover:text-blue-900 hover:underline text-sm inline-block"
                            >
                              {t.name}
                            </button>
                            <span className="ml-2 text-slate-600 font-medium">
                              {t.position}
                            </span>
                            <div className="text-slate-500 mt-1 flex items-center gap-1">
                              <span>前任校:</span>
                              <span className="text-slate-700">{t.fromSchool}</span>
                            </div>
                          </div>
                          {OFFICIAL_SOURCES_DATA[t.sourceId] && (
                            <button
                              onClick={() => onOpenSource(OFFICIAL_SOURCES_DATA[t.sourceId])}
                              className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors"
                              title="公報情報源を確認"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-slate-400 text-center">
                      当年度の公報記載の転入情報はありません
                    </div>
                  )}
                </div>

                {/* Transferred Out */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
                    <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                      <span>転出教職員 ({currentYearPersonnel.transferredOut.length}名)</span>
                    </div>
                    <span className="text-[11px] text-amber-700 font-medium">当校から他校等へ転出</span>
                  </div>

                  {currentYearPersonnel.transferredOut.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {currentYearPersonnel.transferredOut.map((t, idx) => (
                        <div key={idx} className="p-3.5 hover:bg-slate-50/70 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <button
                              onClick={() => onSelectTeacher(t.teacherId)}
                              className="font-semibold text-blue-700 hover:text-blue-900 hover:underline text-sm inline-block"
                            >
                              {t.name}
                            </button>
                            <span className="ml-2 text-slate-600 font-medium">
                              {t.position}
                            </span>
                            <div className="text-slate-500 mt-1 flex items-center gap-1">
                              <span>異動先:</span>
                              <span className="text-slate-700 font-medium">{t.toSchool}</span>
                            </div>
                          </div>
                          {OFFICIAL_SOURCES_DATA[t.sourceId] && (
                            <button
                              onClick={() => onOpenSource(OFFICIAL_SOURCES_DATA[t.sourceId])}
                              className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors"
                              title="公報情報源を確認"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-slate-400 text-center">
                      当年度の公報記載の転出情報はありません
                    </div>
                  )}
                </div>

                {/* Newly Appointed */}
                {currentYearPersonnel.newlyAppointed.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
                      <div className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                        <span>新規採用教職員 ({currentYearPersonnel.newlyAppointed.length}名)</span>
                      </div>
                      <span className="text-[11px] text-blue-700 font-medium">新規採用発令</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {currentYearPersonnel.newlyAppointed.map((t, idx) => (
                        <div key={idx} className="p-3.5 hover:bg-slate-50/70 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <button
                              onClick={() => onSelectTeacher(t.teacherId)}
                              className="font-semibold text-blue-700 hover:text-blue-900 hover:underline text-sm inline-block"
                            >
                              {t.name}
                            </button>
                            <span className="ml-2 text-slate-600 font-medium">
                              {t.position}
                            </span>
                          </div>
                          {OFFICIAL_SOURCES_DATA[t.sourceId] && (
                            <button
                              onClick={() => onOpenSource(OFFICIAL_SOURCES_DATA[t.sourceId])}
                              className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors"
                              title="公報情報源を確認"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                この年度の公報データは現在照合・アーカイブ中です
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            学校ID: <span className="font-mono">{school.id}</span>
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
