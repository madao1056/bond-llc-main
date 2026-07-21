---
publishDate: 2026-05-18T00:00:00.000Z
title: "WebページをワンクリックでMarkdown保存するChrome拡張「MD Clipper」を公開しました"
excerpt: "気になったWebページをそのままMarkdownファイルとして保存できるChrome拡張「MD Clipper」をChrome Web Storeで公開しました。すべての処理はローカルで完結し、サーバーへのデータ送信は一切ありません。"
image: "~/assets/images/md-clipper-icon.png"
category: "お知らせ"
tags:
  - お知らせ
  - プロダクト
  - ツール
author: "橋口真幸"
metadata:
  title: "Chrome拡張「MD Clipper」公開のお知らせ"
  description: "WebページをワンクリックでMarkdown保存するChrome拡張「MD Clipper」をリリース。Readability.js+Turndown.jsでローカル変換。プライバシー重視設計。"
---

WebページをMarkdownファイルとしてワンクリックで保存できるChrome拡張機能「**MD Clipper**」をChrome Web Storeで公開しました。

## MD Clipperとは

調査・執筆・ナレッジ管理などで「このページ、Markdownで手元に残したい」と感じたことはありませんか？

MD ClipperはWebページの本文を自動抽出し、きれいなMarkdown形式に変換してローカルに保存するChrome拡張です。すべての処理は手元のブラウザ内で完結するため、外部サーバーへのデータ送信はありません。

## 主な機能

- **ワンクリック保存** — 拡張アイコンをクリックするだけでMarkdownファイルを生成
- **右クリックメニュー対応** — コンテキストメニューから「Save as Markdown」を選択
- **自動フォルダ整理** — サブフォルダを指定して保存先を管理
- **Markdownプレビュー** — 保存前にプレビューして確認
- **クリップボードコピー** — ファイル保存せずそのままコピーも可能

## 技術的な特徴

- **Readability.js** による広告・ナビゲーション除去の高精度本文抽出
- **Turndown.js** によるHTML→Markdown変換
- **完全ローカル処理** — プライバシー重視、外部通信なし

## インストール

Chrome Web Storeから無料でインストールできます。

[MD Clipper — Chrome Web Storeでインストール](https://chromewebstore.google.com/detail/md-clipper/bbbbnllmkbgabkneapcmmlibgjppbfhb)

---

ツール開発やAI活用の仕組み化についてのご相談はお気軽にどうぞ。

[お問い合わせはこちら](/contact)
