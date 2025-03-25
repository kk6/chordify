# 🎸 Chordify

**Chordify** は、ギターコードを視覚的に記録・管理し、毎日のコード練習を効率的に支援するためのWebアプリケーションです。

---

## ✨ 主な機能

- ギターコードを視覚的に簡単登録・管理
- タグによるコード分類と検索
- コード響きを音声再生で確認
- 未習得コードを毎日ランダム表示
- 音名表示と度数表示をワンタッチで切り替え可能
- 学習進捗をグラフ化して表示

---

## 🚀 使用技術

### フロントエンド
- React
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- Tone.js
- Recharts

### バックエンド
- Django Ninja
- PostgreSQL
- Gunicorn + Uvicorn (ASGI)

### インフラ
- Docker / docker-compose
- Nginx（リバースプロキシ）

---

## 🐳 開発環境構築

**Dockerを使って環境を簡単に立ち上げることができます。**

### 起動方法

プロジェクトルートで以下を実行:

```bash
docker compose build
docker compose up
```

### サービスへのアクセス

- フロントエンド： `http://localhost`
- バックエンドAPI： `http://localhost/api/`

---

## 📚 ドキュメント

詳細な設計や開発情報は[`docs/`](./docs)フォルダをご覧ください。

- [プロジェクト概要](./docs/01_overview.md)
- [要件定義](./docs/02_requirements.md)
- [データベース設計](./docs/03_database.md)
- [REST API設計](./docs/04_api.md)
- [UI設計](./docs/05_ui.md)
- [開発環境構築手順](./docs/06_setup.md)

---

## 💡 貢献

改善提案やバグ報告などは歓迎です。気軽にIssueやPull Requestを送ってください！
