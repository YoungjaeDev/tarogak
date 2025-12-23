/**
 * Sacred Texts Archive에서 Rider-Waite 타로 카드 이미지 다운로드
 * 출처: https://www.sacred-texts.com/tarot/pkt/
 * 라이선스: Public Domain (1909년 출판)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const BASE_URL = 'https://www.sacred-texts.com/tarot/pkt/img';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'cards');

interface CardMapping {
  sourceFile: string;
  targetFile: string;
}

// 메이저 아르카나 매핑 (22장)
const majorArcana: CardMapping[] = [
  { sourceFile: 'ar00.jpg', targetFile: 'major-00-fool.jpg' },
  { sourceFile: 'ar01.jpg', targetFile: 'major-01-magician.jpg' },
  { sourceFile: 'ar02.jpg', targetFile: 'major-02-high-priestess.jpg' },
  { sourceFile: 'ar03.jpg', targetFile: 'major-03-empress.jpg' },
  { sourceFile: 'ar04.jpg', targetFile: 'major-04-emperor.jpg' },
  { sourceFile: 'ar05.jpg', targetFile: 'major-05-hierophant.jpg' },
  { sourceFile: 'ar06.jpg', targetFile: 'major-06-lovers.jpg' },
  { sourceFile: 'ar07.jpg', targetFile: 'major-07-chariot.jpg' },
  { sourceFile: 'ar08.jpg', targetFile: 'major-08-strength.jpg' },
  { sourceFile: 'ar09.jpg', targetFile: 'major-09-hermit.jpg' },
  { sourceFile: 'ar10.jpg', targetFile: 'major-10-wheel-of-fortune.jpg' },
  { sourceFile: 'ar11.jpg', targetFile: 'major-11-justice.jpg' },
  { sourceFile: 'ar12.jpg', targetFile: 'major-12-hanged-man.jpg' },
  { sourceFile: 'ar13.jpg', targetFile: 'major-13-death.jpg' },
  { sourceFile: 'ar14.jpg', targetFile: 'major-14-temperance.jpg' },
  { sourceFile: 'ar15.jpg', targetFile: 'major-15-devil.jpg' },
  { sourceFile: 'ar16.jpg', targetFile: 'major-16-tower.jpg' },
  { sourceFile: 'ar17.jpg', targetFile: 'major-17-star.jpg' },
  { sourceFile: 'ar18.jpg', targetFile: 'major-18-moon.jpg' },
  { sourceFile: 'ar19.jpg', targetFile: 'major-19-sun.jpg' },
  { sourceFile: 'ar20.jpg', targetFile: 'major-20-judgement.jpg' },
  { sourceFile: 'ar21.jpg', targetFile: 'major-21-world.jpg' },
];

// 마이너 아르카나 - 완드 (14장)
const wands: CardMapping[] = [
  { sourceFile: 'waac.jpg', targetFile: 'wands-01-ace.jpg' },
  { sourceFile: 'wa02.jpg', targetFile: 'wands-02.jpg' },
  { sourceFile: 'wa03.jpg', targetFile: 'wands-03.jpg' },
  { sourceFile: 'wa04.jpg', targetFile: 'wands-04.jpg' },
  { sourceFile: 'wa05.jpg', targetFile: 'wands-05.jpg' },
  { sourceFile: 'wa06.jpg', targetFile: 'wands-06.jpg' },
  { sourceFile: 'wa07.jpg', targetFile: 'wands-07.jpg' },
  { sourceFile: 'wa08.jpg', targetFile: 'wands-08.jpg' },
  { sourceFile: 'wa09.jpg', targetFile: 'wands-09.jpg' },
  { sourceFile: 'wa10.jpg', targetFile: 'wands-10.jpg' },
  { sourceFile: 'wapa.jpg', targetFile: 'wands-11-page.jpg' },
  { sourceFile: 'wakn.jpg', targetFile: 'wands-12-knight.jpg' },
  { sourceFile: 'waqu.jpg', targetFile: 'wands-13-queen.jpg' },
  { sourceFile: 'waki.jpg', targetFile: 'wands-14-king.jpg' },
];

// 마이너 아르카나 - 컵 (14장)
const cups: CardMapping[] = [
  { sourceFile: 'cuac.jpg', targetFile: 'cups-01-ace.jpg' },
  { sourceFile: 'cu02.jpg', targetFile: 'cups-02.jpg' },
  { sourceFile: 'cu03.jpg', targetFile: 'cups-03.jpg' },
  { sourceFile: 'cu04.jpg', targetFile: 'cups-04.jpg' },
  { sourceFile: 'cu05.jpg', targetFile: 'cups-05.jpg' },
  { sourceFile: 'cu06.jpg', targetFile: 'cups-06.jpg' },
  { sourceFile: 'cu07.jpg', targetFile: 'cups-07.jpg' },
  { sourceFile: 'cu08.jpg', targetFile: 'cups-08.jpg' },
  { sourceFile: 'cu09.jpg', targetFile: 'cups-09.jpg' },
  { sourceFile: 'cu10.jpg', targetFile: 'cups-10.jpg' },
  { sourceFile: 'cupa.jpg', targetFile: 'cups-11-page.jpg' },
  { sourceFile: 'cukn.jpg', targetFile: 'cups-12-knight.jpg' },
  { sourceFile: 'cuqu.jpg', targetFile: 'cups-13-queen.jpg' },
  { sourceFile: 'cuki.jpg', targetFile: 'cups-14-king.jpg' },
];

// 마이너 아르카나 - 소드 (14장)
const swords: CardMapping[] = [
  { sourceFile: 'swac.jpg', targetFile: 'swords-01-ace.jpg' },
  { sourceFile: 'sw02.jpg', targetFile: 'swords-02.jpg' },
  { sourceFile: 'sw03.jpg', targetFile: 'swords-03.jpg' },
  { sourceFile: 'sw04.jpg', targetFile: 'swords-04.jpg' },
  { sourceFile: 'sw05.jpg', targetFile: 'swords-05.jpg' },
  { sourceFile: 'sw06.jpg', targetFile: 'swords-06.jpg' },
  { sourceFile: 'sw07.jpg', targetFile: 'swords-07.jpg' },
  { sourceFile: 'sw08.jpg', targetFile: 'swords-08.jpg' },
  { sourceFile: 'sw09.jpg', targetFile: 'swords-09.jpg' },
  { sourceFile: 'sw10.jpg', targetFile: 'swords-10.jpg' },
  { sourceFile: 'swpa.jpg', targetFile: 'swords-11-page.jpg' },
  { sourceFile: 'swkn.jpg', targetFile: 'swords-12-knight.jpg' },
  { sourceFile: 'swqu.jpg', targetFile: 'swords-13-queen.jpg' },
  { sourceFile: 'swki.jpg', targetFile: 'swords-14-king.jpg' },
];

// 마이너 아르카나 - 펜타클 (14장)
const pentacles: CardMapping[] = [
  { sourceFile: 'peac.jpg', targetFile: 'pentacles-01-ace.jpg' },
  { sourceFile: 'pe02.jpg', targetFile: 'pentacles-02.jpg' },
  { sourceFile: 'pe03.jpg', targetFile: 'pentacles-03.jpg' },
  { sourceFile: 'pe04.jpg', targetFile: 'pentacles-04.jpg' },
  { sourceFile: 'pe05.jpg', targetFile: 'pentacles-05.jpg' },
  { sourceFile: 'pe06.jpg', targetFile: 'pentacles-06.jpg' },
  { sourceFile: 'pe07.jpg', targetFile: 'pentacles-07.jpg' },
  { sourceFile: 'pe08.jpg', targetFile: 'pentacles-08.jpg' },
  { sourceFile: 'pe09.jpg', targetFile: 'pentacles-09.jpg' },
  { sourceFile: 'pe10.jpg', targetFile: 'pentacles-10.jpg' },
  { sourceFile: 'pepa.jpg', targetFile: 'pentacles-11-page.jpg' },
  { sourceFile: 'pekn.jpg', targetFile: 'pentacles-12-knight.jpg' },
  { sourceFile: 'pequ.jpg', targetFile: 'pentacles-13-queen.jpg' },
  { sourceFile: 'peki.jpg', targetFile: 'pentacles-14-king.jpg' },
];

const allCards: CardMapping[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles,
];

function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(destPath);
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlinkSync(destPath);
        reject(err);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      reject(err);
    });
  });
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Downloading ${allCards.length} tarot card images...`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allCards.length; i++) {
    const card = allCards[i];
    const sourceUrl = `${BASE_URL}/${card.sourceFile}`;
    const destPath = path.join(OUTPUT_DIR, card.targetFile);

    // 이미 존재하면 스킵
    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${allCards.length}] Skipped (exists): ${card.targetFile}`);
      successCount++;
      continue;
    }

    try {
      await downloadFile(sourceUrl, destPath);
      console.log(`[${i + 1}/${allCards.length}] Downloaded: ${card.targetFile}`);
      successCount++;

      // 서버 부하 방지를 위한 딜레이 (300ms)
      await sleep(300);
    } catch (error) {
      console.error(`[${i + 1}/${allCards.length}] Failed: ${card.targetFile} - ${error}`);
      failCount++;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`Success: ${successCount}/${allCards.length}`);
  if (failCount > 0) {
    console.log(`Failed: ${failCount}/${allCards.length}`);
  }
}

main().catch(console.error);
