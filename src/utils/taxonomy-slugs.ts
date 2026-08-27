/**
 * カテゴリ・タグの URL スラッグ辞書
 *
 * 既定の slugify（limax）は日本語をピンイン変換するため、
 * 「AI活用」→ `ai-huo2-yong4`、「ホームページ制作」→ `hmupji` のように
 * 意味を持たない URL が生成されてしまう。
 * 仕様 URL-01（英語小文字・ハイフン区切り）を満たすため、
 * 日本語のタクソノミー名に対して明示的な英語スラッグを与える。
 *
 * 辞書に無い名前は従来どおり cleanSlug にフォールバックする。
 */
export const TAXONOMY_SLUG_MAP: Record<string, string> = {
  // --- カテゴリ ---
  AI活用: 'ai',
  お知らせ: 'news',
  ホームページ制作: 'web-production',
  補助金: 'subsidy',

  // --- タグ ---
  Claude: 'claude',
  DX: 'dx',
  DX支援: 'dx-support',
  ECサイト: 'ec-site',
  G検定: 'g-certification',
  JDLA: 'jdla',
  Web制作: 'web-production',
  ものづくり補助金: 'monodukuri-subsidy',
  システム開発: 'system-development',
  ツール: 'tools',
  データ活用: 'data-utilization',
  フリーランス: 'freelance',
  プロダクト: 'product',
  中小企業: 'sme',
  会社情報: 'company-info',
  地方: 'local',
  外注: 'outsourcing',
  契約: 'contract',
  宮崎県: 'miyazaki',
  情報格差: 'information-gap',
  新事業進出補助金: 'shinjigyo-subsidy',
  業務効率化: 'business-efficiency',
  資格: 'certification',
  農業: 'agriculture',
};

/** タクソノミー名から URL スラッグを引く。未登録なら undefined */
export const findTaxonomySlug = (name: string): string | undefined => TAXONOMY_SLUG_MAP[name?.trim()];
