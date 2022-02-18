# Serverless Framework Node Express API on AWS

このプロジェクトは、Node14 Expressを利用し
AWS LambdaからS3にJSONデータを保存するものです。


### Deployment

パッケージをインストール
```
npm install
```

デプロイ
```
serverless deploy
```
コマンド実行後、エンドポイントが出力されます。
```bash
endpoints:
  ANY - https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  api: aws-node-express-api-dev-api
layers:
  None
```
