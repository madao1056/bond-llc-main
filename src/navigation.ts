import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'ぼんどについて',
      href: getPermalink('/about'),
    },
    {
      text: 'サービス',
      links: [
        {
          text: 'サービス一覧',
          href: getPermalink('/services'),
        },
        {
          text: 'Web制作・運用',
          href: getPermalink('/services/web-production'),
        },
        {
          text: 'EC構築・販売支援',
          href: getPermalink('/services/ec'),
        },
        {
          text: 'MEO・LINE・集客',
          href: getPermalink('/services/marketing'),
        },
        {
          text: 'DX・業務効率化',
          href: getPermalink('/services/dx'),
        },
      ],
    },
    {
      text: '実績',
      href: getPermalink('/works'),
    },
    {
      text: 'みやびと',
      href: 'https://miyabito.bond-llc.jp/',
    },
    {
      text: '会社概要',
      href: getPermalink('/company'),
    },
  ],
  actions: [
    {
      text: 'お問い合わせ',
      href: getPermalink('/contact'),
      class: 'btn-primary'
    }
  ],
};

export const footerData = {
  links: [
    {
      title: 'サービス',
      links: [
        { text: 'Web制作・運用', href: getPermalink('/services/web-production') },
        { text: 'EC構築・販売支援', href: getPermalink('/services/ec') },
        { text: 'MEO・LINE・集客', href: getPermalink('/services/marketing') },
        { text: 'DX・業務効率化', href: getPermalink('/services/dx') },
      ],
    },
    {
      title: '会社情報',
      links: [
        { text: 'ぼんどについて', href: getPermalink('/about') },
        { text: 'ミッション・ビジョン', href: getPermalink('/about#mvv') },
        { text: '会社概要', href: getPermalink('/company') },
        { text: 'アクセス', href: getPermalink('/company#access') },
      ],
    },
    {
      title: 'コンテンツ',
      links: [
        { text: '実績・事例', href: getPermalink('/works') },
        { text: 'みやびと', href: 'https://miyabito.bond-llc.jp/' },
        { text: 'お知らせ', href: getBlogPermalink() },
      ],
    },
    {
      title: 'お問い合わせ',
      links: [
        { text: 'お問い合わせ', href: getPermalink('/contact') },
        { text: 'LINE公式アカウント', href: 'https://lin.ee/LYodITQO' },
        { text: 'よくある質問', href: getPermalink('/faq') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'プライバシーポリシー', href: getPermalink('/privacy') },
    { text: '利用規約', href: getPermalink('/terms') },
  ],
  socialLinks: [
    { ariaLabel: 'LINE', icon: 'tabler:brand-line', href: 'https://lin.ee/LYodITQO' },
  ],
  footNote: `
    <span class="text-sm">© 2025 合同会社ぼんど All rights reserved.</span>
  `,
};