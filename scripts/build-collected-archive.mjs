#!/usr/bin/env node

import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const input = resolve(process.argv.find((value) => value.startsWith('--input='))?.slice(8) ?? '../kyoiku-jinji-archive/data/demo/unreviewed-catalog.json');
const output = resolve(process.argv.find((value) => value.startsWith('--output='))?.slice(9) ?? 'src/data/collectedSouthKanto.json');
const sourceMap = {
  'jp-11-saitama-education-personnel': ['埼玉県', '埼玉県教育委員会'],
  'jp-12-chiba-education-personnel': ['千葉県', '千葉県教育委員会'],
  'jp-12-chiba-education-personnel-2025': ['千葉県', '千葉県教育委員会'],
  'jp-13-tokyo-education-personnel': ['東京都', '東京都教育委員会'],
  'jp-14-kanagawa-personnel': ['神奈川県', '神奈川県教育委員会'],
  'jp-14100-yokohama-management-personnel': ['神奈川県', '横浜市教育委員会'],
};

const raw = JSON.parse(await readText(input));
const records = raw.records.filter((record) => sourceMap[record.source]).map((record) => {
  const [prefecture, issuer] = sourceMap[record.source];
  return [record.id, record.source, prefecture, issuer, record.year ?? 0, record.name, record.from ?? '', record.to ?? '', record.role ?? '', record.event ?? 'その他公式発表', record.page ?? 0, record.locator ?? 0, record.status ?? 'unreviewed'];
});
const payload = {
  generatedAt: raw.generated_at ?? null,
  provenance: input,
  reviewStatus: 'unreviewed',
  fields: ['id', 'sourceId', 'prefecture', 'issuer', 'year', 'name', 'from', 'to', 'role', 'event', 'page', 'locator', 'parseStatus'],
  records,
};
await mkdir(dirname(output), { recursive: true });
await pipeline(Readable.from([JSON.stringify(payload)]), createWriteStream(output));
console.log(JSON.stringify({ output, records: records.length, sources: Object.keys(sourceMap).length }, null, 2));

async function readText(path) {
  const chunks = [];
  for await (const chunk of createReadStream(path)) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
