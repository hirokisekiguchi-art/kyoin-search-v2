import React from 'react';
import { TeacherCandidate } from '../types';
import { Building2, MapPin, Calendar, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TeacherCardProps {
  teacher: TeacherCandidate;
  onSelect: (teacher: TeacherCandidate) => void;
  onSelectSchool: (schoolId: string) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onSelect,
  onSelectSchool,
}) => {
  const latestEvent = teacher.timeline[0];
  const isVerified = teacher.verificationStatus === '確認済み';

  return (
    <div className="h-full bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 hover:-translate-y-0.5 hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges / Meta */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{teacher.prefecture} {teacher.municipality}</span>
            <span aria-hidden="true">·</span>
            <span>{teacher.schoolType}</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {teacher.latestFiscalYear}年度公報
          </span>
        </div>

        {/* Teacher Name & Position */}
        <div className="mb-2">
          {teacher.kana && (
            <div className="text-[11px] font-normal text-slate-400 mb-0.5">
              {teacher.kana}
            </div>
          )}
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <button onClick={() => onSelect(teacher)} className="text-left text-xl font-bold text-slate-900 decoration-2 underline-offset-4 group-hover:text-blue-700 group-hover:underline transition-colors">
              {teacher.name}
            </button>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/50">
              {teacher.currentPosition}
            </span>
          </div>
        </div>

        {/* Organization */}
        <div className="mt-2 text-sm text-slate-700 flex items-start gap-1.5">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-slate-400 mr-1.5">最新所属:</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectSchool(teacher.currentSchoolId);
              }}
              className="font-medium text-slate-800 hover:text-blue-700 hover:underline text-left inline"
            >
              {teacher.currentSchoolName}
            </button>
          </div>
        </div>

        {/* Latest Career Milestone Snippet */}
        {latestEvent && (
          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
            <div className="flex items-center justify-between font-medium text-slate-700 mb-0.5">
              <span>{latestEvent.fiscalYear}年度【{latestEvent.eventType}】</span>
              <span className="text-[10px] text-slate-400">{latestEvent.effectiveDate}</span>
            </div>
            {latestEvent.previousSchoolName ? (
              <div className="text-slate-500 truncate text-[11px]">
                前任: {latestEvent.previousSchoolName}
              </div>
            ) : (
              <div className="text-slate-500 truncate text-[11px]">
                {latestEvent.note || '公報登載記録'}
              </div>
            )}
          </div>
        )}

        {/* Homonym Alert */}
        {teacher.homonymCandidateCount && teacher.homonymCandidateCount > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50/70 px-2.5 py-1 rounded border border-amber-200/60">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span className="truncate">同姓同名の別候補あり（{teacher.homonymCandidateCount}件）</span>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className={`text-[11px] flex items-center gap-1 font-medium ${isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
          {isVerified ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {isVerified ? '公式公報照合済' : '収集済み・未照合候補'}
        </span>
        <button
          onClick={() => onSelect(teacher)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn"
        >
          <span>経歴タイムラインを見る</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
