import { School, TeacherCandidate } from '../types';

const CHARACTER_VARIANTS: Record<string, string> = {
  '髙': '高', '﨑': '崎', '邊': '辺', '邉': '辺', '澤': '沢', '齋': '斉', '齊': '斉',
  '濱': '浜', '國': '国', '廣': '広', '德': '徳', '島': '島', '塃': '境',
};

export const normalizeSearchText = (value = '') =>
  value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[髙﨑邊邉澤齋齊濱國廣德島塃]/g, (char) => CHARACTER_VARIANTS[char] || char)
    .replace(/[　\s・·ー_・‐-―−‐-―－]/g, '')
    .replace(/[()（）\[\]【】「」『』、。,.]/g, '');

const fieldScore = (value: string | undefined, query: string, weight: number) => {
  const normalized = normalizeSearchText(value);
  if (!normalized) return 0;
  if (normalized === query) return weight * 4;
  if (normalized.startsWith(query)) return weight * 2;
  if (normalized.includes(query)) return weight;
  return 0;
};

export const scoreTeacher = (teacher: TeacherCandidate, rawQuery: string) => {
  const query = normalizeSearchText(rawQuery);
  if (!query) return 1;
  let score = fieldScore(teacher.name, query, 100)
    + fieldScore(teacher.kana, query, 85)
    + fieldScore(teacher.currentSchoolName, query, 55)
    + fieldScore(teacher.currentPosition, query, 28)
    + fieldScore(teacher.municipality, query, 25)
    + fieldScore(teacher.prefecture, query, 20);

  for (const event of teacher.timeline) {
    score += fieldScore(event.schoolName, query, 18);
    score += fieldScore(event.previousSchoolName, query, 12);
    score += fieldScore(event.note, query, 4);
  }
  return score;
};

export const scoreSchool = (school: School, rawQuery: string) => {
  const query = normalizeSearchText(rawQuery);
  if (!query) return 1;
  let score = fieldScore(school.name, query, 100)
    + fieldScore(school.prefecture, query, 25)
    + fieldScore(school.municipality, query, 30)
    + fieldScore(school.founder, query, 18);
  school.formerNames?.forEach((name) => { score += fieldScore(name, query, 55); });
  school.personnelByYear.forEach((year) => {
    score += fieldScore(year.principal?.name, query, 14);
    score += fieldScore(year.vicePrincipal?.name, query, 14);
    [...year.transferredIn, ...year.transferredOut].forEach((person) => {
      score += fieldScore(person.name, query, 8);
    });
  });
  return score;
};

export const sortByRelevance = <T,>(items: T[], query: string, scorer: (item: T, query: string) => number) =>
  items
    .map((item, index) => ({ item, index, score: scorer(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
