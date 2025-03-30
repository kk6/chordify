# フロントエンドとNginxリバースプロキシのDocker設定

このドキュメントでは、フロントエンド（Reactアプリケーション）とNginxリバースプロキシのDocker設定について説明します。

## 概要

-   **フロントエンド:** ReactアプリケーションをNode.js環境でビルドし、Nginxで静的ファイルとして配信します。
-   **Nginxリバースプロキシ:** 外部からのリクエストを受け付け、フロントエンドコンテナまたはバックエンドコンテナ（API）に振り分けます。

## ファイル構成

```
.
├── frontend/
│   ├── Dockerfile          # フロントエンドのビルドと配信設定
│   ├── nginx.conf          # フロントエンド配信用のNginx設定 (SPA対応)
│   └── .dockerignore       # フロントエンドのビルドコンテキスト除外設定
├── nginx/
│   ├── Dockerfile          # Nginxリバースプロキシの設定
│   ├── nginx.conf          # リバースプロキシのNginx設定
│   └── .dockerignore       # Nginxのビルドコンテキスト除外設定
└── docker-compose.yml      # (既存) 各サービスを連携させる設定
```

## フロントエンド (`frontend/`)

`frontend/` ディレクトリには、Reactアプリケーションのソースコードと設定ファイルが含まれます。

### 主要な設定ファイル

-   **`package.json`**: プロジェクトの依存関係（React, Rspack関連など）と、`npm start`（開発サーバー起動）や `npm run build`（本番ビルド）などのスクリプトを定義します。
-   **`rspack.config.js`**: Rspackビルドツール自体の設定ファイルです。エントリーポイント (`src/index.tsx`)、出力先 (`dist` ディレクトリ)、TypeScriptの処理方法 (`ts-loader`)、HTMLテンプレート (`public/index.html`) の利用などを設定します。
-   **`tsconfig.json`**: TypeScriptコンパイラの設定ファイルです。コンパイルターゲット、JSXの扱い、モジュール解決方法などを定義します。

### `frontend/Dockerfile`

Reactアプリケーションをビルドし、Nginxで配信するためのマルチステージDockerfileです。

```dockerfile
# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock file (assuming npm, yarn, or pnpm)
# Adjust if using a different package manager or lock file name
COPY package*.json ./
# If using yarn.lock or pnpm-lock.yaml, uncomment the relevant line
# COPY yarn.lock ./
# COPY pnpm-lock.yaml ./

# Install dependencies
# Use 'npm ci' for faster, more reliable builds if package-lock.json exists
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (assuming the build script is 'build')
# Adjust the script name if necessary (e.g., 'vite build', 'rspack build')
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the build output from the builder stage
# Adjust the source directory ('build' or 'dist') if your build tool outputs elsewhere
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**解説:**

1.  **ビルドステージ (`builder`):**
    *   `node:20-alpine` イメージをベースにします。
    *   `package.json` とロックファイルをコピーし、`npm install` で依存関係をインストールします。
    *   ソースコード全体をコピーします。
    *   `npm run build` でアプリケーションをビルドします（ビルドスクリプト名はプロジェクトに合わせて調整してください）。ビルド成果物は `/app/dist` に生成される想定です（これもプロジェクトに合わせて調整）。
2.  **配信ステージ:**
    *   `nginx:1.25-alpine` イメージをベースにします。
    *   ビルドステージで生成された静的ファイル (`/app/dist`) をNginxのドキュメントルート (`/usr/share/nginx/html`) にコピーします。
    *   SPAルーティング用のカスタムNginx設定 (`nginx.conf`) をコピーします。
    *   ポート80を公開し、Nginxを起動します。

### `frontend/nginx.conf`

フロントエンドコンテナ内で動作するNginxの設定です。SPA（Single Page Application）のルーティングに対応するため、存在しないパスへのリクエストは `index.html` にフォールバックさせます。

```nginx
server {
    listen 80;
    server_name localhost;

    # Root directory for static files
    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        # Try to serve the requested file directly, then as a directory,
        # otherwise fall back to index.html for SPA routing
        try_files $uri $uri/ /index.html;
    }

    # Optional: Add cache control headers for static assets
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public";
    }

    # Optional: Gzip compression for text-based files
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}
```

### `frontend/.dockerignore`

Dockerイメージのビルド時に不要なファイルやディレクトリをコンテキストから除外するための設定です。これにより、ビルド時間の短縮やイメージサイズの削減が期待できます。

```
# Ignore node_modules directory
node_modules

# Ignore build output directory (adjust if different)
dist
build
.next
.output

# Ignore development specific files
.env*
*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Ignore Git files
.git
.gitignore

# Ignore IDE/editor specific files
.vscode
.idea
*.swp
*.swo
```

## Nginxリバースプロキシ (`nginx/`)

### `nginx/Dockerfile`

リバースプロキシとして動作するNginxコンテナのDockerfileです。

```dockerfile
# Use the official Nginx image from Docker Hub
FROM nginx:1.25-alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**解説:**

*   `nginx:1.25-alpine` イメージをベースにします。
*   デフォルトの設定ファイルを削除し、カスタム設定ファイル (`nginx.conf`) をコピーします。
*   ポート80を公開し、Nginxを起動します。

### `nginx/nginx.conf`

リバースプロキシの主要な設定ファイルです。`docker-compose.yml` で定義されたサービス名（ここでは `frontend` と `backend` を想定）に基づいてリクエストを振り分けます。

```nginx
upstream frontend {
    # Assuming the frontend service is named 'frontend' in docker-compose.yml
    # Adjust the port if the frontend container exposes a different one
    server frontend:80;
}

upstream backend {
    # Assuming the backend service is named 'backend' in docker-compose.yml
    # Adjust the port if the backend container exposes a different one (e.g., 8000 for Django)
    server backend:8000;
}

server {
    listen 80;
    server_name localhost; # Or your domain name

    # Increase max body size for file uploads, etc. (adjust as needed)
    client_max_body_size 50M;

    # Serve static files for the frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://backend; # Forward requests starting with /api/ to the backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Ensure the path is correctly passed (e.g., /api/users -> /api/users)
        # proxy_redirect off; # Usually not needed with proxy_pass
    }

    # Optional: Proxy WebSocket connections if your backend uses them
    # location /ws/ {
    #     proxy_pass http://backend; # Adjust if backend uses a different path for websockets
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection "upgrade";
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    # }

    # Optional: Add security headers
    # add_header X-Frame-Options "SAMEORIGIN" always;
    # add_header X-Content-Type-Options "nosniff" always;
    # add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    # add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;
}
```

**解説:**

*   `upstream` ブロックで、転送先のサービス（`frontend` と `backend`）を定義します。サービス名とポート番号は `docker-compose.yml` の設定に合わせてください。
*   `location /` ブロックで、ルートパスへのアクセスを `frontend` サービスに転送します。
*   `location /api/` ブロックで、`/api/` で始まるパスへのアクセスを `backend` サービスに転送します。
*   必要に応じて、WebSocketのプロキシ設定やセキュリティヘッダーのコメントアウトを解除して使用してください。

### `nginx/.dockerignore`

NginxリバースプロキシのDockerイメージビルド時に不要なファイルを除外します。

```
# Ignore Git files
.git
.gitignore

# Ignore IDE/editor specific files
.vscode
.idea
*.swp
*.swo
```

## 使い方

1.  フロントエンドのソースコードを `frontend/` ディレクトリに配置します（`package.json` などを含む）。
2.  `docker-compose.yml` ファイルを編集し、`frontend` と `nginx` サービスを追加または適切に設定します。
    *   `frontend` サービスの `build` コンテキストを `./frontend` に設定します。
    *   `nginx` サービスの `build` コンテキストを `./nginx` に設定し、ポートマッピング（例: `80:80`）と `depends_on` で `frontend` と `backend` を指定します。
3.  `docker-compose up --build` コマンドでコンテナをビルドして起動します。
