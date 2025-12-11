# ぼんどコーポレートサイト開発ガイドライン

## プロジェクト概要
株式会社ぼんどのコーポレートサイト。AstroWindテンプレートをベースに、ぼんどのブランドアイデンティティを反映したカスタマイズを実施。

## 重要：SEO構造の維持
- **既存のSEO構造を崩さない**: AstroWindのSEO最適化機能は維持
- **メタデータの適切な設定**: 各ページに適切なtitle、description、OGP設定
- **構造化データの維持**: JSON-LDなどの構造化データは保持
- **パフォーマンス最適化**: Core Web Vitalsを意識した実装

## ブランドカラー定義

### メインカラー
```css
--bond-yellow-main: rgb(250 215 7);    /* #FAD707 - 宮崎の太陽 */
--bond-yellow-deep: rgb(208 165 29);   /* #D0A51D - 深い黄色 */
--bond-navy: rgb(31 46 108);           /* #1F2E6C - 信頼のネイビー */
--bond-brown: rgb(115 74 39);          /* #734A27 - ローカル感 */
```

### UIカラー
```css
--bond-surface: rgb(255 255 255);      /* 白 - カード背景 */
--bond-background: rgb(250 250 249);   /* オフホワイト - ページ背景 */
--bond-text-main: rgb(28 28 30);       /* メインテキスト */
--bond-text-sub: rgb(82 82 91);        /* サブテキスト */
--bond-border: rgb(228 228 231);       /* ボーダー */
```

## トンマナ（デザイン指針）

### 基本方針
- **あたたかい**: 地域に寄り添う温かさ
- **信頼感**: プロフェッショナルな印象
- **ローカル**: 宮崎らしさ、地域性
- **整理された**: 情報が見やすく整理されている

### レイアウト
- コンテナ幅: 最大1280px（max-w-7xl）
- セクション間余白: 64-96px
- カード角丸: 8-12px（rounded-lg）
- 基本グリッド: 12カラム

### タイポグラフィ
```css
/* 見出し */
H1: 32-48px (text-4xl to text-6xl)
H2: 24-32px (text-2xl to text-4xl)
H3: 20-24px (text-xl to text-2xl)

/* 本文 */
Body: 16px (text-base)
Small: 14px (text-sm)
Caption: 12px (text-xs)

/* 行間 */
見出し: leading-tight
本文: leading-relaxed
```

### ボタンスタイル
- **Primary**: ネイビー背景、白文字
- **Secondary**: 白背景、ネイビー枠線
- **Accent**: 黄色背景、ネイビー文字

## ファイル構成

```
src/
├── components/
│   ├── widgets/        # ページセクションコンポーネント
│   │   ├── BondHero.astro      # ヒーローセクション
│   │   ├── BondAbout.astro     # MVVセクション
│   │   ├── BondServices.astro  # サービス紹介
│   │   ├── BondWorks.astro     # 実績紹介
│   │   ├── BondMedia.astro     # みやびと紹介
│   │   ├── BondStrength.astro  # 強み紹介
│   │   └── BondCTA.astro       # CTA
│   └── ui/            # 基本UIコンポーネント
├── pages/
│   ├── index.astro    # トップページ
│   ├── about.astro    # ぼんどについて
│   ├── services/      # サービス詳細
│   ├── works/         # 実績一覧
│   ├── media/         # みやびと
│   ├── company.astro  # 会社概要
│   └── contact.astro  # お問い合わせ
└── assets/
    └── styles/
        └── tailwind.css  # カスタムスタイル
```

## 開発時の注意事項

### SEO関連
1. **メタタグの設定**: 各ページで適切なメタ情報を設定
2. **画像の最適化**: alt属性、適切なサイズ、遅延読み込み
3. **構造化データ**: Organization、LocalBusiness、BreadcrumbListなど
4. **sitemap.xml**: 自動生成される設定を維持
5. **robots.txt**: クローラー設定の適切な管理

### パフォーマンス
1. **画像最適化**: WebP形式、適切なサイズ
2. **フォント**: font-displayの適切な設定
3. **CSS**: 未使用のスタイル削除
4. **JavaScript**: 必要最小限に抑える

### アクセシビリティ
1. **セマンティックHTML**: 適切なタグの使用
2. **ARIA属性**: 必要に応じて追加
3. **キーボード操作**: フォーカス管理
4. **色のコントラスト**: WCAG基準を満たす

## コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run check:astro

# リント
npm run check:eslint

# フォーマット
npm run fix:prettier
```

## MVV（ミッション・ビジョン・バリュー）

### Mission（使命）
地域の事業者とお客さまをつなぎ、価値が正しく届く環境をつくる

### Vision（ビジョン）
宮崎を起点に、関係性を基盤とした持続的な経済圏を広げる

### Values（価値観）
- **よしなに力**: 期待を超える対応
- **共創スタンス**: 一緒に作り上げる
- **仕組み化と再現性**: 持続可能な成長

## 主要コンテンツ

### サービス
1. Web制作・運用
2. EC構築・オンライン販売支援
3. MEO・LINE・集客導線設計
4. ローカルDX・業務効率化

### 特徴
- 宮崎に根ざしたローカル企業
- 地域事業者の課題に寄り添う
- デジタル×リアルの融合
- みやびとメディア運営

## 更新履歴
- 2024-12-05: 初版作成
- カラーパレット定義
- 基本コンポーネント作成
- SEO構造の維持方針策定