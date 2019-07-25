# 使い方

## 環境変数の設定
AzureのSpeach Serviceのキー情報は環境変数から取得するため、以下の環境変数名でキーを登録しておく。

`SPEECH_SERVICE_KEY`

キーの値はAzureから持ってくる。


## インストール

` npm install `

## 実行

` node index.js`

getのクエリパラメータでテキストを渡すことで、wavファイルがダウンロードできる。

exzample
`localhost:8080/?text=テスト`

## heroku環境
https://arcane-temple-52272.herokuapp.com/?text=

例えば
`https://arcane-temple-52272.herokuapp.com/?text=サンプルテキストです。`

と蹴ると、「サンプルテキストです。」と発話するwavがダウンロードされる。
