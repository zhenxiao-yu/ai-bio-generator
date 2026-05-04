// Client-side bio analysis — zero API cost, runs in <1ms

const BUZZWORDS = [
  "passionate about",
  "results-driven",
  "self-motivated",
  "team player",
  "go-getter",
  "synergy",
  "leverage",
  "disruptive",
  "innovative",
  "thought leader",
  "guru",
  "ninja",
  "rockstar",
  "wizard",
  "visionary",
  "game-changer",
  "dynamic",
  "proactive",
  "strategic",
  "hardworking",
  "detail-oriented",
  "fast-paced",
  "out of the box",
  "value add",
  "holistic",
  "move the needle",
];

const POWER_WORDS = [
  "built",
  "launched",
  "led",
  "founded",
  "created",
  "designed",
  "increased",
  "reduced",
  "generated",
  "achieved",
  "delivered",
  "engineered",
  "developed",
  "shipped",
  "scaled",
  "drove",
  "transformed",
  "pioneered",
  "authored",
  "established",
  "manages",
  "directs",
  "accelerated",
  "streamlined",
  "optimized",
];

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function fleschKincaidGrade(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  if (sentences.length === 0 || words.length === 0) return 0;

  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const grade =
    0.39 * (words.length / sentences.length) +
    11.8 * (syllableCount / words.length) -
    15.59;
  return Math.max(0, Math.round(grade * 10) / 10);
}

export interface BioAnalysis {
  buzzwords: string[];
  powerWordCount: number;
  readingGrade: number;
  readingLabel: string;
  wordCount: number;
  sentenceCount: number;
  hasCallToAction: boolean;
}

export function analyzeBio(text: string): BioAnalysis {
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);

  const buzzwordsFound = BUZZWORDS.filter((b) => lower.includes(b));
  const powerWordCount = POWER_WORDS.filter((p) => lower.includes(p)).length;
  const readingGrade = fleschKincaidGrade(text);

  let readingLabel: string;
  if (readingGrade <= 6) readingLabel = "Simple";
  else if (readingGrade <= 9) readingLabel = "Clear";
  else if (readingGrade <= 12) readingLabel = "Moderate";
  else readingLabel = "Dense";

  const callToActionPatterns = [
    /follow/i,
    /dm me/i,
    /reach out/i,
    /connect/i,
    /hire/i,
    /book/i,
    /visit/i,
    /check out/i,
    /available for/i,
    /open to/i,
  ];
  const hasCallToAction = callToActionPatterns.some((p) => p.test(text));

  return {
    buzzwords: buzzwordsFound,
    powerWordCount,
    readingGrade,
    readingLabel,
    wordCount: words.length,
    sentenceCount: sentences.length,
    hasCallToAction,
  };
}
