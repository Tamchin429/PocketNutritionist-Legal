// config.js
// PocketNutritionist 公開ページ共通設定。
//
// iOS側のAppSupportInfo.swift（PocketNutritionist/Models/AppSupportInfo.swift）と
// 同じ項目構成にしている。運営者名・問い合わせ先・公式サイトURLが未確定の間は、
// ダミー値（"example@example.com"等）を書かず、必ずnullのままにする。
// 値が確定した時点で、このファイルだけを書き換えれば全ページへ反映される。
const APP_SUPPORT_INFO = {
  operatorName: null,
  supportEmail: "vanish.info@gmail.com",
  privacyEmail: "vanish.info@gmail.com",
  websiteURL: "https://tamchin429.github.io/PocketNutritionist-Legal/",
};

/**
 * HTML特殊文字をエスケープする（operatorName等、将来入力される値が
 * そのままHTMLへ差し込まれてもXSSにならないようにするための最小限の対策）。
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * id要素へ、確定済みの運営者情報・問い合わせ先だけを表示する。
 * kind: "privacy"（プライバシーポリシー用。privacyEmail優先、無ければsupportEmailで代用）
 *       "support"（利用規約・サポートページ用。supportEmailのみ参照）
 * 何も確定していない場合はfallbackTextをそのまま表示する（ダミー表示を作らない）。
 */
function renderContactInto(elementId, kind, fallbackText) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const email =
    kind === "privacy"
      ? APP_SUPPORT_INFO.privacyEmail || APP_SUPPORT_INFO.supportEmail
      : APP_SUPPORT_INFO.supportEmail;

  const parts = [];

  if (APP_SUPPORT_INFO.operatorName) {
    parts.push(
      `<p>運営者：${escapeHtml(APP_SUPPORT_INFO.operatorName)}</p>`
    );
  }

  if (email) {
    const subject = encodeURIComponent(
      "PocketNutritionist お問い合わせ"
    );

    parts.push(
      `<p><a href="mailto:${escapeHtml(email)}?subject=${subject}">${escapeHtml(email)}</a></p>`
    );
  }

  if (APP_SUPPORT_INFO.websiteURL) {
    parts.push(
      `<p><a href="${escapeHtml(APP_SUPPORT_INFO.websiteURL)}">公式サイト</a></p>`
    );
  }

  el.innerHTML =
    parts.length > 0
      ? parts.join("\n")
      : `<p>${escapeHtml(fallbackText)}</p>`;
}
