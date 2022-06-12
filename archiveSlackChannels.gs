/**
 * 実行するメインの関数。
 * スプレッドシートからアーカイブ対象のチャンネルIDを取得し、
 * Slack APIによりSlackチャンネルをアーカイブスする関数を呼び出す。
*/
function getTargetChannnelsAndCallArchiveChannelAPI() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('archive');
  const range = sheet.getRange("A:A");
  const rangeF = sheet.getRange("F:F");
  const values = range.getValues();
  values.shift(); //先頭行の値削除
  const valuesLength = values.length;

  for (let i = 0; i < valuesLength; i++) {
    const channelID = values[i].toString();
    archiveChannelAPI(channelID);
    rangeF.setValue("アーカイブス済");//先頭行の値削除 アーカイブした時だけ値をセットしたい。
  }
  console.log("処理終了")
}

/**
 * Slack APIによりSlackチャンネルをアーカイブスする
 *
 * @param {string} channelID - Slackチャンネル名のID
 * 
 * NOTE:
 * 1.USER_OAUTH_TOKEN　プロジェクトの設定からスクリプトプロパティに格納しておくこと。
 * 2.Scopes スコープ設定はURL参照　https://api.slack.com/methods/conversations.archive
*/
function archiveChannelAPI(channelID) {
  const url = 'https://slack.com/api/conversations.archive';
  const token = PropertiesService.getScriptProperties().getProperty('USER_OAUTH_TOKEN');

  const headers = {
    'Content-Type': 'application/json', // JSON形式でレスポンスを受け取る
    'Authorization': 'Bearer ' + token
  }

  const payload = {   // リクエストパラメータを作成
    'channel': channelID,
  }

  const params = {
    'method': 'POST', // POSTメソッドでリクエストする
    'headers': headers,
    'payload': JSON.stringify(payload)
  }
  console.log(params);

  UrlFetchApp.fetch(url, params);
}
