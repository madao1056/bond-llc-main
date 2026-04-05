export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { buildNotificationEmail, buildAutoReplyEmail } from '~/utils/email-templates';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const name = (data.name ?? '').trim();
    const email = (data.email ?? '').trim();
    const message = (data.message ?? '').trim();
    const company = (data.company ?? '').trim();
    const phone = (data.phone ?? '').trim();
    const service = (data.service ?? '').trim();

    if (!name || !email || !message) {
      return json({ error: 'お名前・メールアドレス・お問い合わせ内容は必須です。' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'メールアドレスの形式が正しくありません。' }, 400);
    }

    const sanitized = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      message: escapeHtml(message),
      company: escapeHtml(company),
      phone: escapeHtml(phone),
      service: escapeHtml(service),
    };

    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return json({ error: 'メール送信の設定が完了していません。' }, 500);
    }

    const resend = new Resend(apiKey);

    const [notification, autoReply] = await Promise.all([
      resend.emails.send({
        from: 'ぼんど お問い合わせ <noreply@bond-llc.jp>',
        to: 'info@bond-llc.jp',
        replyTo: email,
        subject: `【お問い合わせ】${name} 様より`,
        html: buildNotificationEmail(sanitized),
      }),
      resend.emails.send({
        from: 'ぼんど <noreply@bond-llc.jp>',
        to: email,
        subject: '【ぼんど】お問い合わせありがとうございます',
        html: buildAutoReplyEmail(sanitized),
      }),
    ]);

    if (notification.error || autoReply.error) {
      console.error('Resend error:', notification.error ?? autoReply.error);
      return json({ error: 'メールの送信に失敗しました。時間をおいて再度お試しください。' }, 500);
    }

    return json({ success: true }, 200);
  } catch (err) {
    console.error('Contact API error:', err);
    return json({ error: 'サーバーエラーが発生しました。' }, 500);
  }
};
