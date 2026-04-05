interface ContactData {
  company: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const SERVICE_LABELS: Record<string, string> = {
  web: 'Web制作・運用',
  ec: 'EC構築・オンライン販売支援',
  marketing: 'MEO・LINE・集客導線設計',
  dx: 'ローカルDX・業務効率化',
  other: 'その他',
};

const BRAND = {
  navy: '#1F2E6C',
  yellow: '#FAD707',
  bg: '#FAFAF9',
  text: '#1C1C1E',
  textSub: '#52525B',
  border: '#E4E4E7',
} as const;

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Helvetica Neue',Arial,'Hiragino Kaku Gothic ProN',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BRAND.border};max-width:100%;">
        <tr><td style="background:${BRAND.navy};padding:24px 32px;">
          <span style="color:${BRAND.yellow};font-size:20px;font-weight:bold;">ぼんど</span>
          <span style="color:#fff;font-size:14px;margin-left:12px;">bond-llc.jp</span>
        </td></tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr><td style="background:${BRAND.bg};padding:16px 32px;text-align:center;font-size:12px;color:${BRAND.textSub};">
          &copy; 合同会社ぼんど &mdash; info@bond-llc.jp
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  if (!value) return '';
  return `<tr>
    <td style="padding:8px 12px;font-size:13px;color:${BRAND.textSub};white-space:nowrap;vertical-align:top;border-bottom:1px solid ${BRAND.border};">${label}</td>
    <td style="padding:8px 12px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${value}</td>
  </tr>`;
}

export function buildNotificationEmail(data: ContactData): string {
  const serviceLabel = SERVICE_LABELS[data.service] ?? data.service;
  const body = `
    <h2 style="margin:0 0 8px;font-size:18px;color:${BRAND.navy};">新しいお問い合わせ</h2>
    <p style="margin:0 0 24px;font-size:13px;color:${BRAND.textSub};">Webサイトからお問い合わせがありました。</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-bottom:none;">
      ${row('会社名・店舗名', data.company)}
      ${row('お名前', data.name)}
      ${row('メールアドレス', data.email)}
      ${row('電話番号', data.phone)}
      ${row('サービス', serviceLabel)}
    </table>
    <div style="margin-top:24px;">
      <p style="margin:0 0 8px;font-size:13px;color:${BRAND.textSub};">お問い合わせ内容:</p>
      <div style="padding:16px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};line-height:1.7;white-space:pre-wrap;">${data.message}</div>
    </div>`;
  return layout(body);
}

export function buildAutoReplyEmail(data: ContactData): string {
  const body = `
    <h2 style="margin:0 0 8px;font-size:18px;color:${BRAND.navy};">お問い合わせありがとうございます</h2>
    <p style="margin:0 0 24px;font-size:14px;color:${BRAND.text};line-height:1.7;">
      ${data.name} 様<br /><br />
      この度はお問い合わせいただき、誠にありがとうございます。<br />
      以下の内容で受け付けいたしました。<br />
      通常1〜2営業日以内にご返信いたしますので、今しばらくお待ちください。
    </p>
    <div style="padding:16px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};line-height:1.7;white-space:pre-wrap;">${data.message}</div>
    <p style="margin:24px 0 0;font-size:13px;color:${BRAND.textSub};line-height:1.7;">
      ※ このメールは自動送信です。心当たりのない場合はお手数ですが削除してください。<br />
      合同会社ぼんど ／ info@bond-llc.jp
    </p>`;
  return layout(body);
}
