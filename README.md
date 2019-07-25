# 使い方

## 環境変数の設定
AzureのSpeach Serviceのキー情報は環境変数から取得するため、以下の環境変数名でキーを登録しておく。

`SPEECH_SERVICE_KEY`

キーの値はAzureから持ってくる。


## インストール

` npm install `

## 実行

` node tts.ts`

どんなテキストの音声が欲しいかを聞かれるので、音声が欲しい文字列を入力する。 
`TTSOutput.wav` という名称で音声ファイルが作成されるのでオーディオプレーヤーで確認をする。

## heroku環境
`https://arcane-temple-52272.herokuapp.com/`
