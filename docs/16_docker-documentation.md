# バックエンド Docker 構成ドキュメント

このドキュメントは、Pythonアプリケーション（Django）のコンテナ化に使用されているDockerfileの構成について説明します。

## Dockerfileの概要

Dockerfileはマルチステージビルドを採用し、ビルドステージと最終実行ステージに分かれています。これにより、最終的なイメージサイズを小さく保ちながら、効率的なビルドプロセスを実現しています。

![Dockerfileのマルチステージビルド構造](./images/docker-build-flow.svg)

**Note:** このドキュメントはバックエンドのDocker設定に焦点を当てています。フロントエンドおよびNginxリバースプロキシのDocker設定については、[フロントエンド・Nginx Docker 構成ドキュメント](./17_docker_frontend_nginx.md) を参照してください。

## Dockerfile の内容

```dockerfile
# syntax=docker/dockerfile:1.10

# === Build Stage ===
FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Disable Python downloads, because we want to use the system interpreter
ENV UV_PYTHON_DOWNLOADS=0

# Change the working directory to the `app` directory
WORKDIR /app

# Create virtual environment
RUN uv venv .venv

# Install dependencies from lockfile
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --python .venv/bin/python --frozen --no-install-project --no-editable

# Copy the project into the intermediate image
COPY . /app

# Install project itself
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --python .venv/bin/python --frozen

# === Final Stage ===
FROM python:3.12-slim

# Create non-root user
RUN groupadd -r app && useradd -r -g app app

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

WORKDIR /app

# Add healthcheck for container orchestration systems
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/ || exit 1

# Switch to non-root user
USER app

# 開発用デフォルトコマンド（runserverの場合）
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
```

## ビルドステージの詳細説明

ビルドステージでは、アプリケーションとその依存関係を準備します。

1. **ベースイメージ**：`python:3.12-slim`
   - 軽量なPython 3.12イメージを使用

2. **uvツールのコピー**：
   ```dockerfile
   COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
   ```
   - [uv](https://github.com/astral-sh/uv)は高速なPythonパッケージマネージャー

3. **環境変数の設定**：
   ```dockerfile
   ENV UV_PYTHON_DOWNLOADS=0
   ```
   - システムのPythonインタープリタを使用するよう指定

4. **仮想環境の作成**：
   ```dockerfile
   RUN uv venv .venv
   ```
   - プロジェクト用の独立した仮想環境を作成

5. **依存関係のインストール**：
   ```dockerfile
   RUN --mount=type=cache,target=/root/.cache/uv \
       --mount=type=bind,source=uv.lock,target=uv.lock \
       --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
       uv sync --python .venv/bin/python --frozen --no-install-project --no-editable
   ```
   - キャッシュを使用して依存関係をインストール
   - `--frozen`：lockファイルに従って厳密なバージョンを指定
   - `--no-install-project`：プロジェクト自体はこの段階ではインストールしない

6. **プロジェクトコードのコピー**：
   ```dockerfile
   COPY . /app
   ```
   - アプリケーションコード全体をイメージにコピー

7. **プロジェクト自体のインストール**：
   ```dockerfile
   RUN --mount=type=cache,target=/root/.cache/uv \
       uv sync --python .venv/bin/python --frozen
   ```
   - プロジェクト自体の依存関係をインストール

## 最終ステージの詳細説明

最終ステージでは、ビルドステージで準備されたアプリケーションを実行可能な状態で配置します。

1. **ベースイメージ**：`python:3.12-slim`
   - ビルドステージと同じく軽量イメージを使用

2. **非rootユーザーの作成**：
   ```dockerfile
   RUN groupadd -r app && useradd -r -g app app
   ```
   - セキュリティ向上のためにappユーザーとグループを作成

3. **アプリケーションのコピー**：
   ```dockerfile
   COPY --from=builder --chown=app:app /app /app
   ```
   - ビルドステージからアプリケーションをコピー
   - 適切な権限（app:app）を設定

4. **環境変数の設定**：
   ```dockerfile
   ENV PATH="/app/.venv/bin:$PATH"
   ```
   - 仮想環境のbinディレクトリをPATHに追加

5. **ポート公開**：
   ```dockerfile
   EXPOSE 8000
   ```
   - Djangoのデフォルトポートを公開

6. **ヘルスチェックの追加**：
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s \
     CMD curl -f http://localhost:8000/ || exit 1
   ```
   - コンテナオーケストレーション用のヘルスチェック設定

7. **非rootユーザーへの切り替え**：
   ```dockerfile
   USER app
   ```
   - セキュリティ向上のためにappユーザーとして実行

8. **デフォルトコマンド**：
   ```dockerfile
   CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
   ```
   - Djangoの開発サーバーを起動

## 最適化ポイント

このDockerfile構成には、以下の最適化ポイントが含まれています：

1. **マルチステージビルド**：
   - ビルドツールや中間生成物を最終イメージに含めない
   - 最終イメージのサイズを最小限に抑える

2. **キャッシュの活用**：
   - `--mount=type=cache`によるビルド時間の短縮
   - 依存関係のダウンロードやインストールを高速化

3. **効率的な依存関係管理**：
   - [uv](https://github.com/astral-sh/uv)の使用で依存関係インストールを高速化
   - lockファイルによる依存関係バージョンの厳密な管理

4. **セキュリティ対策**：
   - 非rootユーザーでの実行
   - 適切なファイル権限の設定

5. **コンテナオーケストレーション対応**：
   - ヘルスチェックの組み込み
   - 標準的なポート設定

## 本番環境での利用

この構成は開発環境向けに最適化されていますが、本番環境では別途用意した本番環境用のDockerfileを使用することをお勧めします。以下に本番環境用のDockerfileと主な違いを示します。

![本番環境用Dockerfileのマルチステージビルド構造](./images/docker-prod-build-flow.svg)

### 本番環境用Dockerfile

```dockerfile
# syntax=docker/dockerfile:1.10

# === Build Stage ===
FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Disable Python downloads, because we want to use the system interpreter
ENV UV_PYTHON_DOWNLOADS=0

# Change the working directory to the `app` directory
WORKDIR /app

# Create virtual environment
RUN uv venv .venv

# Install dependencies from lockfile
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --python .venv/bin/python --frozen --no-install-project --no-editable

# Copy the project into the intermediate image
COPY . /app

# Install project itself
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --python .venv/bin/python --frozen

# Collect static files for production (if needed)
RUN python manage.py collectstatic --noinput

# === Final Stage ===
FROM python:3.12-slim

# Install dependencies for production
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r app && useradd -r -g app app

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app

# Copy collected static files separately for potential volume mounting
COPY --from=builder --chown=app:app /app/staticfiles /app/staticfiles

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Set production environment variables
ENV DJANGO_SETTINGS_MODULE=chordify.settings.production
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

WORKDIR /app

# Add healthcheck for container orchestration systems
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health/ || exit 1

# Switch to non-root user
USER app

# Production: Run as ASGI server with uvicorn
# workers: number of processes (typically CPU cores × 2 + 1 is recommended)
# --lifespan=on: enable application lifespan events
# --proxy-headers: trust proxy headers (when behind Nginx or similar)
CMD ["uvicorn", "chordify.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--lifespan", "on", "--proxy-headers"]
```

### 開発環境との主な違い

1. **ASGIサーバーの使用**：
   - Django `runserver`の代わりに、uvicornを使用してASGIアプリケーションとして実行
   - 複数のワーカープロセスで実行して並列処理能力を向上

2. **静的ファイルの収集と分離**：
   - `collectstatic`コマンドで静的ファイルを事前に収集
   - 別途コピーして潜在的なボリュームマウントに対応

3. **本番環境向け設定**：
   - 本番用設定モジュールを指定（`DJANGO_SETTINGS_MODULE=chordify.settings.production`）
   - パフォーマンス最適化のための環境変数設定

4. **セキュリティ強化**：
   - 必要最小限のパッケージのみインストール
   - ヘルスチェックの追加でコンテナオーケストレーションとの連携を強化

5. **静的ファイルの配信**：
   - 本番環境では通常、NginxなどのWebサーバーと連携して静的ファイルを配信

### 本番環境用Dockerfileの使用方法

本番環境用Dockerfileを`Dockerfile.prod`として保存し、以下のコマンドでビルド・実行します：

```bash
# ビルド
docker build -f Dockerfile.prod -t chordify:prod .

# 実行
docker run -p 8000:8000 chordify:prod
```

本番環境では以下のように環境変数を使用して設定を調整することをお勧めします：

```bash
docker run -p 8000:8000 \
  -e SECRET_KEY="your-secret-key" \
  -e DATABASE_URL="postgres://user:pass@host:port/db" \
  chordify:prod
```

## ビルドと実行方法

イメージをビルドして実行するには：

```bash
# イメージのビルド
docker build -t myapp:latest .

# コンテナの実行
docker run -p 8000:8000 myapp:latest
```

## トラブルシューティング

1. **依存関係のインストールに失敗する場合**：
   - `uv.lock`と`pyproject.toml`が正しく配置されているか確認
   - uvのバージョンを確認（必要に応じて特定のバージョンを指定）

2. **コンテナが起動しない場合**：
   - ログを確認：`docker logs <container_id>`
   - ヘルスチェックの状態を確認：`docker inspect <container_id>`

3. **パーミッションエラーが発生する場合**：
   - ボリュームマウントしたファイルの権限を確認
   - appユーザーのUID/GIDとホストのUID/GIDの整合性を確認
