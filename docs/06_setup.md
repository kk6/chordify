# 開発環境構築手順（Docker）

## 前提条件
- Docker & docker-composeがインストール済み

## 起動手順

プロジェクトルートで以下のコマンドを実行

```bash
docker compose build
docker compose up
```

## 利用可能なサービス

| サービス | URL |
|---------|-----|
| アプリ | `http://localhost` |
| API | `http://localhost/api/` |
| フロント | `http://localhost/` |

## フォルダ構成の概要

```
project-root/
├── backend/  # Django Ninjaプロジェクト
├── frontend/ # Reactプロジェクト
├── nginx/    # Nginxリバースプロキシ
└── docker-compose.yml
```

## 補足事項
- Pythonの依存関係は`uv`を利用（ビルド時のみ）
- ASGIは`Gunicorn`+`Uvicorn`を採用
- データベースはPostgreSQLを使用
