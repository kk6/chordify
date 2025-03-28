# 🎸 Chordify

**Chordify** は、ギターコードを視覚的に記録・管理し、毎日のコード練習を効率的に支援するためのWebアプリケーションです。

🚀 開発タスク管理は [GitHub Projects運用ガイド](docs/07_project-management.md) に準拠しています。

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

### 開発ツール
- ruff (リンター・フォーマッター)
- mypy (型チェック)
- pytest / pytest-cov (テスト・カバレッジ)
- Makefile / Taskfile (開発ワークフロー)

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

## 🛠️ 開発コマンド

`Makefile` または `Taskfile` を使用して開発用のコマンドを実行できます。

### Makefile の場合
```bash
# Lint
make lint

# Format
make format

# 型チェック
make type-check

# テスト実行
make test

# カバレッジレポート付きでテスト実行
make test-cov
```

### Taskfile の場合
```bash
# Lint
task lint

# Format
task format

# 型チェック
task type-check

# テスト実行
task test

# カバレッジレポート付きでテスト実行
task test-cov
```

詳細は[開発環境構築手順](./docs/06_setup.md)をご覧ください。

---

## 📚 ドキュメント

詳細な設計や開発情報は[`docs/`](./docs)フォルダをご覧ください。

- [プロジェクト概要](./docs/01_overview.md)
- [要件定義](./docs/02_requirements.md)
- [データベース設計](./docs/03_database.md)
- [REST API設計](./docs/04_api.md)
- [UI設計](./docs/05_ui.md)
- [開発環境構築手順](./docs/06_setup.md)
- [GitHub Projects 運用ガイド](docs/07_project-management.md)
- [Issue運用ガイドライン](docs/08_issue-guideline.md)
- [Issueラベル一覧](docs/09_labels.md)

---
