import React from 'react';
import { School } from '../types';
import { ExternalLink, MapPin, Scale, X } from 'lucide-react';
import { getSchoolGoogleMapsUrl } from '../data/archiveData';

interface SchoolCompareModalProps {
  schools: School[];
  onClose: () => void;
  onRemove: (schoolId: string) => void;
}

export const SchoolCompareModal: React.FC<SchoolCompareModalProps> = ({ schools, onClose, onRemove }) => {
  if (!schools.length) return null;
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#243d35]/50 p-4 backdrop-blur-sm">
      <div className="v2-compare-dialog" role="dialog" aria-modal="true" aria-labelledby="compare-title">
        <div className="flex items-start justify-between gap-4 border-b border-[#d9ddcf] p-5 sm:p-7">
          <div><span className="v2-kicker">COMPARE / 比較</span><h2 id="compare-title" className="mt-2 text-2xl font-semibold"><Scale className="mr-2 inline h-5 w-5" />学校を比べる</h2></div>
          <button onClick={onClose} className="rounded-full border border-[#cbd2c1] p-2" aria-label="比較を閉じる"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-x-auto p-5 sm:p-7">
          <table className="v2-compare-table">
            <thead><tr><th>項目</th>{schools.map((school) => <th key={school.id}>{school.name}<button onClick={() => onRemove(school.id)} aria-label={`${school.name}を比較から外す`}><X className="h-3 w-3" /></button></th>)}</tr></thead>
            <tbody>
              <tr><th>地域</th>{schools.map((school) => <td key={school.id}><MapPin className="inline h-3 w-3" /> {school.prefecture} {school.municipality}</td>)}</tr>
              <tr><th>学校種</th>{schools.map((school) => <td key={school.id}>{school.schoolType}</td>)}</tr>
              <tr><th>設置者</th>{schools.map((school) => <td key={school.id}>{school.founder}</td>)}</tr>
              <tr><th>最新確認</th>{schools.map((school) => <td key={school.id}>{school.latestConfirmedYear}年度</td>)}</tr>
              <tr><th>人事記録</th>{schools.map((school) => <td key={school.id}>{school.totalConfirmedPersonnelCount.toLocaleString('ja-JP')}件</td>)}</tr>
              <tr><th>口コミ</th>{schools.map((school) => <td key={school.id}><a href={school.googleMapsUrl || getSchoolGoogleMapsUrl(school)} target="_blank" rel="noreferrer">地図で見る <ExternalLink className="inline h-3 w-3" /></a></td>)}</tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
