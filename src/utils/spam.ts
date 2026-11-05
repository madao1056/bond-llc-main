/**
 * お問い合わせフォームのスパム判定。
 *
 * - spam: 確実にボット。Lark・メールとも一切送らない
 * - suspicious: 怪しいが人の可能性もある。記録と社内通知はするが、自動返信は送らない
 * - ok: 通常どおり処理する
 *
 * 2026-11 に来た型（名前・本文ともに大小混在のランダム英字、会社名「Xxxxx LLC」、
 * メールは実在の第三者）を確実に止めつつ、英語の正当な問い合わせは通すことを優先している。
 */

export type SpamVerdict = 'ok' | 'suspicious' | 'spam';

export interface SpamInput {
  name: string;
  message: string;
  company?: string;
  /** honeypot（人には見えない入力欄）の値 */
  website?: unknown;
  /** フォーム表示時刻（クライアント時計の ms） */
  formLoadedAt?: unknown;
  /** 送信時刻（クライアント時計の ms）。サーバーとの時計ずれを避けるため経過時間はクライアント時計同士で測る */
  submittedAt?: unknown;
  /** 名刺LPからの送信か（本文が任意なので本文では判定しない） */
  isMeishi?: boolean;
}

export interface SpamResult {
  verdict: SpamVerdict;
  reasons: string[];
}

/** これより早い送信は人間ではありえない */
export const MIN_FILL_MS = 3000;

/** 名刺LPで本文が空のときに入る文言 */
export const MEISHI_EMPTY_MESSAGE = '（メッセージなし）';

const JAPANESE = /[぀-ヿ㐀-鿿ｦ-ﾟ]/;
const FAKE_LLC = /^[A-Z][a-z]{4,10} LLC$/;
const URL_PATTERN = /https?:\/\/|www\./gi;

/**
 * 「大小混在のランダム英字」か。
 * 英字のみ・空白なし・12文字以上で、先頭以外の大文字が3つ以上かつ全体の2割以上、小文字も3つ以上。
 * さらに大文字始まりで区切ったかたまりのうち2文字以下のものが3つ以上（"QwErTy…" のような細切れ）。
 * - "JohnSmith"（短い）・"McDonaldMacArthur"（大文字比率が低い）は該当しない
 * - "SUZUKIHANAKO" のような全大文字のローマ字表記は小文字が無いので該当しない
 * - "MaryAnnMcDonald" は短いかたまりが "Mc" だけなので該当しない
 */
export function isRandomLetters(value: string): boolean {
  if (value.length < 12 || !/^[A-Za-z]+$/.test(value)) return false;
  const innerUpper = (value.slice(1).match(/[A-Z]/g) ?? []).length;
  const lower = (value.match(/[a-z]/g) ?? []).length;
  if (innerUpper < 3 || innerUpper / value.length < 0.2 || lower < 3) return false;
  const shortChunks = value.split(/(?=[A-Z])/).filter((chunk) => chunk.length <= 2).length;
  return shortChunks >= 3;
}

function toMs(value: unknown): number | null {
  const num = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  return typeof num === 'number' && Number.isFinite(num) && num > 0 ? num : null;
}

export function classifySpam(data: SpamInput): SpamResult {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const company = typeof data.company === 'string' ? data.company.trim() : '';
  const rawMessage = typeof data.message === 'string' ? data.message.trim() : '';
  const isMeishi = Boolean(data.isMeishi) || rawMessage === MEISHI_EMPTY_MESSAGE;
  const message = rawMessage === MEISHI_EMPTY_MESSAGE ? '' : rawMessage;

  const spam: string[] = [];
  const suspicious: string[] = [];

  // 1. honeypot
  const honeypot = typeof data.website === 'string' ? data.website.trim() : data.website ? String(data.website) : '';
  if (honeypot) spam.push('honeypot');

  // 2. 入力にかかった時間（値が無い・不正なら判定しない＝古いキャッシュのページからの送信を落とさない）
  const loadedAt = toMs(data.formLoadedAt);
  // submittedAt が無いときにサーバー時計で代用すると、クライアントとの時計ずれで人の送信を落としうるので判定しない
  const submittedAt = toMs(data.submittedAt);
  if (loadedAt !== null && submittedAt !== null) {
    const elapsed = submittedAt - loadedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) spam.push(`too-fast(${elapsed}ms)`);
  }

  // 3. ランダム英字
  const nameRandom = isRandomLetters(name);
  const companyFake = FAKE_LLC.test(company) || isRandomLetters(company);
  if (isMeishi) {
    // 名刺LPは本文が任意なので、名前と会社名で判定する（名刺LPには会社名欄が無いので空なら名前だけで判定）
    // サイト経由（entryFrom=meishi）で日本語の本文がある場合は人の可能性が高いので確定スパムにしない
    if (nameRandom && (!company || companyFake) && !JAPANESE.test(message)) spam.push('random-name');
    else if (nameRandom) suspicious.push('random-name');
  } else {
    const messageRandom = isRandomLetters(message);
    if (nameRandom && messageRandom) spam.push('random-name-and-message');
    else if (nameRandom) suspicious.push('random-name');
    else if (messageRandom) suspicious.push('random-message');
  }

  // 4. 怪しいだけのもの（人の可能性も残る）
  const hasJapanese = JAPANESE.test(`${name}${company}${message}`);
  if (message && !hasJapanese && !/\s/.test(message) && message.length < 40) suspicious.push('short-no-space-message');
  if (!hasJapanese && FAKE_LLC.test(company)) suspicious.push('llc-pattern-company');
  if ((`${message} ${company}`.match(URL_PATTERN) ?? []).length >= 3) suspicious.push('many-urls');
  if (name.length > 100) suspicious.push('long-name');
  if (message.length > 5000) suspicious.push('long-message');

  // honeypot だけが理由で日本語の入力がある場合は、ブラウザの自動入力で埋まった人の可能性があるので黙って捨てない
  if (spam.length === 1 && spam[0] === 'honeypot' && hasJapanese) {
    return { verdict: 'suspicious', reasons: ['honeypot-with-japanese', ...suspicious] };
  }
  if (spam.length) return { verdict: 'spam', reasons: [...spam, ...suspicious] };
  if (suspicious.length) return { verdict: 'suspicious', reasons: suspicious };
  return { verdict: 'ok', reasons: [] };
}
