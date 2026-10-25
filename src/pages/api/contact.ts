export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { buildNotificationEmail, buildAutoReplyEmail } from '~/utils/email-templates';
import { sendInquiryToLark, type InquirySource } from '~/utils/lark';

/** 別ドメインのフォーム（名刺LP）からの送信を受け付けるオリジン */
const ALLOWED_ORIGINS = ['https://lp-meishi-bond.vercel.app'];

/** フォームの選択肢の値 → 表示名（contact.astro の options と揃える） */
const SERVICE_LABELS: Record<string, string> = {
  web: 'Web制作・運用',
  ec: 'EC構築・オンライン販売支援',
  marketing: 'MEO・LINE・集客導線設計',
  dx: 'ローカルDX・業務効率化',
  ai: '訪問AI導入サポート',
  other: 'その他',
};

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin);
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin');
  if (!isAllowedOrigin(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function json(body: Record<string, unknown>, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/**
 * 流入元を決める。名刺LPは source=meishi を送ってくる。
 * サイト内は、最初に開いたページの from パラメータ（?from=instagram 等）と入口ページで判定する。
 */
function resolveSource(data: Record<string, unknown>): InquirySource {
  const source = String(data.source ?? '');
  const entryFrom = String(data.entryFrom ?? '');
  const entryPath = String(data.entryPath ?? '');
  if (source === 'meishi' || entryFrom === 'meishi') return '名刺';
  if (entryFrom === 'instagram') return 'Instagram';
  if (entryPath === '/ai' || entryPath.startsWith('/ai/') || entryPath.startsWith('/ai?')) return '訪問AI導入ページ';
  return 'サイト';
}

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
};

export const POST: APIRoute = async ({ request }) => {
  const cors = corsHeaders(request);
  try {
    const data = await request.json();

    const name = (data.name ?? '').trim();
    const email = (data.email ?? '').trim();
    const company = (data.company ?? '').trim();
    const phone = (data.phone ?? '').trim();
    const serviceValue = (data.service ?? '').trim();
    const service = SERVICE_LABELS[serviceValue] ?? serviceValue;
    const business = (data.business ?? '').trim();
    const page = (data.page ?? '').trim();
    const source = resolveSource(data);
    // 名刺LPはメッセージ任意のため、空でも受け付ける
    const message = (data.message ?? '').trim() || (source === '名刺' ? '（メッセージなし）' : '');

    if (!name || !email || !message) {
      return json({ error: 'お名前・メールアドレス・お問い合わせ内容は必須です。' }, 400, cors);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'メールアドレスの形式が正しくありません。' }, 400, cors);
    }

    // Lark への記録・通知はメールと並行して行い、失敗してもお問い合わせは止めない
    const larkTask = sendInquiryToLark({ source, name, email, message, company, phone, service, business, page }).catch(
      (err) => console.error('Lark連携エラー:', err)
    );

    const mailMessage = business ? `事業ジャンル: ${business}\n\n${message}` : message;
    const sanitized = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      message: escapeHtml(mailMessage),
      company: escapeHtml(company),
      phone: escapeHtml(phone),
      service: escapeHtml(service),
    };

    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      await larkTask;
      return json({ error: 'メール送信の設定が完了していません。' }, 500, cors);
    }

    const resend = new Resend(apiKey);

    const [notification, autoReply] = await Promise.all([
      resend.emails.send({
        from: 'ぼんど お問い合わせ <noreply@bond-llc.jp>',
        to: 'info@bond-llc.jp',
        replyTo: email,
        subject: `【お問い合わせ／${source}】${name} 様より`,
        html: buildNotificationEmail(sanitized),
      }),
      resend.emails.send({
        from: 'ぼんど <noreply@bond-llc.jp>',
        to: email,
        subject: '【ぼんど】お問い合わせありがとうございます',
        html: buildAutoReplyEmail(sanitized),
      }),
    ]);

    await larkTask;

    if (notification.error || autoReply.error) {
      console.error('Resend error:', notification.error ?? autoReply.error);
      return json({ error: 'メールの送信に失敗しました。時間をおいて再度お試しください。' }, 500, cors);
    }

    return json({ success: true }, 200, cors);
  } catch (err) {
    console.error('Contact API error:', err);
    return json({ error: 'サーバーエラーが発生しました。' }, 500, cors);
  }
};
