/**
 * あの先生 - 公立学校人事アーカイブ
 * Core Data Models & Type Definitions
 */

export type SchoolType =
  | '小学校'
  | '中学校'
  | '義務教育学校'
  | '高等学校'
  | '中等教育学校'
  | '特別支援学校'
  | '教育委員会'
  | '教育事務所'
  | '教育センター'
  | 'その他公立教育機関';

export type EventType =
  | '転任'
  | '新任'
  | '新規採用'
  | '昇任'
  | '退職'
  | '辞職'
  | '再任用'
  | '指導主事等転出'
  | '派遣'
  | '任期満了'
  | 'その他公式発表';

export type VerificationStatus = '確認済み' | '確認中' | '情報不足';

export interface OfficialSource {
  id: string;
  issuer: string; // 発行機関 (例: 東京都教育委員会, 神奈川県教育委員会)
  documentTitle: string; // 資料名 (例: 令和8年度 教職員定期人事異動公報)
  fiscalYear: number; // 年度 (例: 2026)
  publishedAt: string; // 公開日 (例: 2026-03-28)
  pageOrSheet: string; // 該当頁・シート (例: 第3分冊 p.42)
  rowOrLine?: string; // 該当行 (例: No. 1284)
  officialUrl?: string; // 公式アーカイブURL (例: https://www.kyoiku.metro.tokyo.lg.jp/...)
  sourceDigestSha256: string; // ハッシュ値
  rawRecordText: string; // 公報原文字列
}

export interface CareerEvent {
  id: string;
  fiscalYear: number; // 年度
  effectiveDate: string; // 発令日 (例: 2026-04-01)
  eventType: EventType; // 異動種別
  schoolId: string; // 安定学校ID
  schoolName: string; // 発令時点の学校・機関名
  position: string; // 役職 (例: 校長, 主幹教諭, 教諭, 指導主事)
  previousSchoolId?: string; // 前所属学校ID
  previousSchoolName?: string; // 前所属学校名
  previousPosition?: string; // 前職
  isPromotion?: boolean; // 昇任フラグ
  source: OfficialSource; // 情報源
  verificationStatus: VerificationStatus;
  note?: string; // 公式資料記載の備考 (例: 専修免許, 教科: 数学 など)
}

export interface TeacherCandidate {
  id: string; // 安定人物ID (同一人物と確認されたID)
  name: string; // 氏名 (例: 佐藤 健一)
  kana?: string; // ふりがな (公報記載時のみ)
  currentSchoolId: string; // 最新確認所属ID
  currentSchoolName: string; // 最新確認所属名
  currentPosition: string; // 最新確認役職
  prefecture: string; // 最新確認都道府県
  municipality: string; // 市区町村
  schoolType: SchoolType;
  latestFiscalYear: number; // 最新確認年度
  timeline: CareerEvent[]; // 異動・所属タイムライン
  verificationStatus: VerificationStatus;
  homonymCandidateCount?: number; // 同姓同名の別候補数
  homonymNote?: string; // 同姓同名区別のための注記 (例: 同姓同名の別人候補が1件あります)
  isDemoData?: boolean;
}

export interface SchoolHistoryItem {
  year: number;
  type: '改称' | '統合' | '新設' | '義務教育学校移行' | '閉校' | '自治体合併';
  description: string;
  sourceNote: string;
}

export interface SchoolPersonnelYear {
  fiscalYear: number;
  principal?: { teacherId: string; name: string; effectiveYear: number }; // 校長
  vicePrincipal?: { teacherId: string; name: string; effectiveYear: number }; // 教頭
  transferredIn: {
    teacherId: string;
    name: string;
    position: string;
    fromSchool: string;
    eventType: EventType;
    sourceId: string;
  }[];
  transferredOut: {
    teacherId: string;
    name: string;
    position: string;
    toSchool: string;
    eventType: EventType;
    sourceId: string;
  }[];
  newlyAppointed: {
    teacherId: string;
    name: string;
    position: string;
    eventType: EventType;
    sourceId: string;
  }[];
  retired: {
    teacherId: string;
    name: string;
    position: string;
    eventType: EventType;
    sourceId: string;
  }[];
}

export interface School {
  id: string; // 恒久学校ID
  name: string;
  formerNames?: string[]; // 過去の名称
  schoolType: SchoolType;
  prefecture: string;
  municipality: string;
  founder: string; // 設置者 (例: 東京都, 世田谷区教育委員会)
  postalCode?: string;
  address?: string;
  history: SchoolHistoryItem[];
  personnelByYear: SchoolPersonnelYear[];
  latestConfirmedYear: number;
  totalConfirmedPersonnelCount: number;
  isDemoData?: boolean;
  googleMapsUrl?: string; // Googleマップ検索・口コミ直接リンク (例: https://www.google.com/maps/search/?api=1&query=...)
  isMinamiKantoPriority?: boolean; // 南関東スモールスタート先行枠
}

export interface SearchFilterState {
  query: string;
  searchType: 'all' | 'teacher' | 'school';
  prefecture: string;
  municipality: string;
  schoolType: string;
  fiscalYear: string;
  eventType: string;
}

export interface RecentGazetteUpdate {
  id: string;
  issuer: string;
  title: string;
  fiscalYear: number;
  updateDate: string;
  recordsCount: number;
  description: string;
  status: '公式照合完了' | '新着更新';
}

/**
 * Section 21 & 22:
 * 観測データ (Personnel Observation) & 審査・可逆的統合モデル
 */
export interface PersonnelObservation {
  id: string;
  sourceId: string;
  sourceTitle: string;
  fiscalYear: number;
  extractedName: string;
  extractedPosition: string;
  extractedNewOrg: string;
  extractedOldOrg?: string;
  extractedEventType: EventType;
  confidenceScore: number; // 人間レビュー優先度スコア (0-100)
  reviewStatus: '承認済み' | '確認中' | '却下' | '要追加照合';
  assignedTeacherId?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: '人物統合' | '人物分離' | '承認' | '却下' | 'データ修正' | '非表示化';
  targetType: 'teacher' | 'school' | 'observation';
  targetId: string;
  targetName: string;
  details: string;
  reversible: boolean;
}
