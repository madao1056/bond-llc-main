/**
 * お問い合わせを Lark Base に記録し、担当者へ Lark で通知する。
 * 設定（環境変数）が揃っていない場合は何もしない。
 */

const LARK_API = 'https://open.larksuite.com/open-apis';

/** 流入元（Base の「流入元」選択肢と同じ表記） */
export type InquirySource = '名刺' | 'Instagram' | '訪問AI導入ページ' | 'サイト';

export interface Inquiry {
  source: InquirySource;
  name: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  service: string;
  business: string;
  page: string;
  /** スパム判定で「怪しい」となったときの印（例: 【要確認】）。内容と通知の先頭に付ける */
  flag?: string;
}

interface LarkConfig {
  appId: string;
  appSecret: string;
  appToken: string;
  tableId: string;
  notifyOpenId: string;
}

function getConfig(): LarkConfig | null {
  const config: LarkConfig = {
    appId: import.meta.env.LARK_APP_ID ?? '',
    appSecret: import.meta.env.LARK_APP_SECRET ?? '',
    appToken: import.meta.env.LARK_INQUIRY_APP_TOKEN ?? '',
    tableId: import.meta.env.LARK_INQUIRY_TABLE_ID ?? '',
    notifyOpenId: import.meta.env.LARK_NOTIFY_OPEN_ID ?? '',
  };
  return config.appId && config.appSecret && config.appToken && config.tableId ? config : null;
}

async function larkFetch(path: string, body: unknown, token?: string): Promise<Record<string, any>> {
  const res = await fetch(LARK_API + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Lark ${path}: ${json.code} ${json.msg}`);
  return json;
}

/**
 * Base への記録と通知を行う。失敗してもお問い合わせ自体は止めないよう、呼び出し側で例外を握りつぶす前提。
 */
export async function sendInquiryToLark(inquiry: Inquiry): Promise<void> {
  const config = getConfig();
  if (!config) {
    console.warn('Lark の設定が無いため、お問い合わせの Lark 連携をスキップしました');
    return;
  }

  const { tenant_access_token: token } = await larkFetch('/auth/v3/tenant_access_token/internal', {
    app_id: config.appId,
    app_secret: config.appSecret,
  });

  await larkFetch(
    `/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records`,
    {
      fields: {
        お名前: inquiry.name,
        受付日時: Date.now(),
        流入元: inquiry.source,
        対応状況: '未対応',
        興味のあるサービス: inquiry.service,
        会社名: inquiry.company,
        メールアドレス: inquiry.email,
        電話番号: inquiry.phone,
        事業ジャンル: inquiry.business,
        内容: inquiry.flag ? `${inquiry.flag}${inquiry.message}` : inquiry.message,
        送信ページ: inquiry.page,
      },
    },
    token
  );

  if (!config.notifyOpenId) return;

  const details: Array<[string, string]> = [
    ['会社名', inquiry.company],
    ['興味のあるサービス', inquiry.service],
    ['事業ジャンル', inquiry.business],
    ['メール', inquiry.email],
    ['電話', inquiry.phone],
  ];
  const lines: string[] = [
    `${inquiry.flag ?? ''}【${inquiry.source}】${inquiry.name} 様からお問い合わせがありました`,
    ...details.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
    '',
    inquiry.message,
    '',
    `一覧: https://tjp6segy1eo3.jp.larksuite.com/base/${config.appToken}`,
  ];

  await larkFetch(
    '/im/v1/messages?receive_id_type=open_id',
    {
      receive_id: config.notifyOpenId,
      msg_type: 'text',
      content: JSON.stringify({ text: lines.join('\n') }),
    },
    token
  );
}
