import collected from './collectedSouthKanto.json';
import type { EventType, OfficialSource, School, SchoolPersonnelYear, SchoolType, TeacherCandidate } from '../types';

type CompactRecord = [string, string, string, string, number, string, string, string, string, string, number, number, string];

const rows = collected.records as CompactRecord[];
const schoolMap = new Map<string, School>();
export const COLLECTED_SOURCES_DATA: Record<string, OfficialSource> = {};

export const COLLECTED_TEACHERS: TeacherCandidate[] = rows.map((row) => {
  const [observationId, sourceId, prefecture, issuer, fiscalYear, name, from, to, role, rawEvent, page, locator, parseStatus] = row;
  const currentSchoolName = to || from || '所属未確認';
  const currentSchoolId = currentSchoolName === '所属未確認' ? `org-unresolved-${observationId}` : stableId('sch', prefecture, currentSchoolName);
  const eventType = normalizeEventType(rawEvent);
  const source = makeSource({ observationId, sourceId, issuer, fiscalYear, name, from, to, role, rawEvent, page, locator, parseStatus });
  COLLECTED_SOURCES_DATA[source.id] = source;
  const teacher: TeacherCandidate = {
    id: `cand-${observationId}`,
    name,
    currentSchoolId,
    currentSchoolName,
    currentPosition: role || '役職未確認',
    prefecture,
    municipality: municipalityOf(currentSchoolName),
    schoolType: schoolTypeOf(currentSchoolName),
    latestFiscalYear: fiscalYear,
    verificationStatus: '情報不足',
    homonymNote: '人物統合前の観測候補です。同姓同名やOCR誤読の可能性があるため、1観測を1候補として表示しています。',
    timeline: [{
      id: `event-${observationId}`,
      fiscalYear,
      effectiveDate: `${fiscalYear}-04-01`,
      eventType,
      schoolId: currentSchoolId,
      schoolName: currentSchoolName,
      position: role || '役職未確認',
      previousSchoolId: from ? stableId('sch', prefecture, from) : undefined,
      previousSchoolName: from || undefined,
      source,
      verificationStatus: '情報不足',
      note: `機械抽出候補（${parseStatus}）。原資料との人手照合前です。`,
    }],
  };
  addSchoolEvent(teacher, source.id, from, to, eventType);
  return teacher;
});

export const COLLECTED_SCHOOLS: School[] = [...schoolMap.values()].sort((a, b) =>
  a.prefecture.localeCompare(b.prefecture, 'ja') || a.name.localeCompare(b.name, 'ja'),
);

export const COLLECTED_DATA_SUMMARY = {
  generatedAt: collected.generatedAt,
  reviewStatus: collected.reviewStatus,
  observations: COLLECTED_TEACHERS.length,
  schools: COLLECTED_SCHOOLS.length,
} as const;

function addSchoolEvent(teacher: TeacherCandidate, sourceId: string, from: string, to: string, eventType: EventType) {
  const event = teacher.timeline[0];
  if (to) {
    const school = ensureSchool(to, teacher.prefecture, teacher.latestFiscalYear);
    const year = ensureYear(school, teacher.latestFiscalYear);
    const item = { teacherId: teacher.id, name: teacher.name, position: teacher.currentPosition, eventType, sourceId };
    if (eventType === '新規採用' || eventType === '新任') year.newlyAppointed.push(item);
    else if (eventType === '退職' || eventType === '辞職' || eventType === '任期満了') year.retired.push(item);
    else year.transferredIn.push({ ...item, fromSchool: from || '前所属未確認' });
    school.totalConfirmedPersonnelCount += 1;
  }
  if (from && from !== to) {
    const school = ensureSchool(from, teacher.prefecture, teacher.latestFiscalYear);
    ensureYear(school, teacher.latestFiscalYear).transferredOut.push({ teacherId: teacher.id, name: teacher.name, position: event.position, toSchool: to || '異動先未確認', eventType, sourceId });
  }
}

function ensureSchool(name: string, prefecture: string, fiscalYear: number) {
  const id = stableId('sch', prefecture, name);
  const existing = schoolMap.get(id);
  if (existing) { existing.latestConfirmedYear = Math.max(existing.latestConfirmedYear, fiscalYear); return existing; }
  const school: School = {
    id,
    name,
    schoolType: schoolTypeOf(name),
    prefecture,
    municipality: municipalityOf(name),
    founder: founderOf(prefecture, name),
    history: [],
    personnelByYear: [],
    latestConfirmedYear: fiscalYear,
    totalConfirmedPersonnelCount: 0,
    isMinamiKantoPriority: true,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`,
  };
  schoolMap.set(id, school);
  return school;
}

function ensureYear(school: School, fiscalYear: number): SchoolPersonnelYear {
  let year = school.personnelByYear.find((item) => item.fiscalYear === fiscalYear);
  if (!year) { year = { fiscalYear, transferredIn: [], transferredOut: [], newlyAppointed: [], retired: [] }; school.personnelByYear.push(year); }
  return year;
}

function makeSource(value: { observationId: string; sourceId: string; issuer: string; fiscalYear: number; name: string; from: string; to: string; role: string; rawEvent: string; page: number; locator: number; parseStatus: string }): OfficialSource {
  return {
    id: `source-${value.observationId}`,
    issuer: value.issuer,
    documentTitle: `${value.fiscalYear}年度 教職員人事異動資料（収集ID: ${value.sourceId}）`,
    fiscalYear: value.fiscalYear,
    publishedAt: '公開日未照合',
    pageOrSheet: value.page ? `p.${value.page}` : '頁未確認',
    rowOrLine: value.locator ? `抽出位置 ${value.locator}` : undefined,
    sourceDigestSha256: '未照合',
    rawRecordText: [value.name, value.from && `旧所属:${value.from}`, value.to && `新所属:${value.to}`, value.role, value.rawEvent].filter(Boolean).join(' / '),
  };
}

function normalizeEventType(value: string): EventType {
  const aliases: Record<string, EventType> = { 転任: '転任', 転出: '転任', 転入: '転任', 昇任: '昇任', 採用: '新規採用', 新規採用: '新規採用', 退職: '退職', 辞職: '辞職', 再任用: '再任用', 新任: '新任', 派遣: '派遣', 任期満了: '任期満了' };
  return aliases[value] ?? 'その他公式発表';
}

function schoolTypeOf(name: string): SchoolType {
  if (/特別支援|養護学校/.test(name)) return '特別支援学校';
  if (/義務教育学校/.test(name)) return '義務教育学校';
  if (/中等教育学校/.test(name)) return '中等教育学校';
  if (/高等学校|高校/.test(name)) return '高等学校';
  if (/中学校|中学/.test(name)) return '中学校';
  if (/小学校|小学/.test(name)) return '小学校';
  if (/教育委員会/.test(name)) return '教育委員会';
  if (/教育事務所/.test(name)) return '教育事務所';
  if (/教育センター/.test(name)) return '教育センター';
  return 'その他公立教育機関';
}

function municipalityOf(name: string) {
  return name.match(/(?:東京都|神奈川県|埼玉県|千葉県)?([^\s]{1,12}?(?:市|区|町|村))/)?.[1] ?? '自治体未確認';
}

function founderOf(prefecture: string, name: string) {
  const municipality = municipalityOf(name);
  return municipality === '自治体未確認' ? `${prefecture}教育委員会（要確認）` : `${municipality}教育委員会（要確認）`;
}

function stableId(prefix: string, ...parts: string[]) {
  const text = parts.join('|').normalize('NFKC').replace(/[\s　]/g, '');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) { hash ^= text.charCodeAt(index); hash = Math.imul(hash, 16777619); }
  return `${prefix}-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
