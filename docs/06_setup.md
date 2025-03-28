# 開発環境構築手順（Docker）

## 前提条件
- Docker & docker-composeがインストール済み
- 開発ワークフロー用に Make または [Task](https://taskfile.dev/)（任意）

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
chordify/
├── backend/         # Django Ninjaプロジェクト
│   ├── pyproject.toml  # Pythonツール設定
│   └── ...
├── frontend/        # Reactプロジェクト
├── nginx/           # Nginxリバースプロキシ
├── Makefile         # 開発タスク自動化
├── Taskfile.yml     # 開発タスク自動化 (Task CLI用)
└── docker-compose.yml
```

## 開発用ツール

### コード品質管理

バックエンド開発では以下のコード品質管理ツールを使用します:

| ツール | 目的 |
|--------|------|
| ruff | 高速なPythonリンターとフォーマッター（isort機能含む） |
| mypy | 静的型チェック |
| pytest | テストフレームワーク |
| pytest-cov | テストカバレッジレポート作成 |

### コマンド実行方法

プロジェクトでは、開発用コマンドを簡単に実行するため、MakefileとTaskfileの両方をサポートしています。

#### Makefileを使う場合

```bash
# リンティング
make lint

# 自動フォーマット
make format

# 型チェック
make type-check

# テスト実行
make test

# カバレッジレポート付きでテスト実行
make test-cov

# 全チェック実行
make check-all
```

#### Taskfileを使う場合
[Task](https://taskfile.dev/)がインストールされている環境では:

```bash
# リンティング
task lint

# 自動フォーマット
task format

# 型チェック
task type-check

# テスト実行
task test

# カバレッジレポート付きでテスト実行
task test-cov

# 全チェック実行
task check-all
```

#### 直接Dockerコマンドを使う場合

```bash
# リンティング
docker compose exec backend ruff check .

# 自動フォーマット
docker compose exec backend ruff format .

# 型チェック
docker compose exec backend mypy .

# テスト実行
docker compose exec backend pytest

# カバレッジレポート付きでテスト実行
docker compose exec backend pytest --cov=.
```

## 設定ファイル

### pyproject.toml

バックエンドディレクトリの`./backend/pyproject.toml`ファイルにて、各種開発ツールの設定を行っています。このファイルには以下のような設定が含まれています：

- **ruff** - リンティングとコードフォーマット設定（isort機能含む）
- **mypy** - 静的型チェック設定
- **pytest** - テスト実行設定
- **coverage** - コードカバレッジ計測設定

詳細な設定内容については、最新の`backend/pyproject.toml`ファイルを直接参照してください。

## 補足事項
- Pythonの依存関係は`uv`を利用（ビルド時のみ）
- ASGIは`Gunicorn`+`Uvicorn`を採用
- データベースはPostgreSQLを使用
- コード品質を維持するために継続的にリンティングとテストを実行することを推奨
