# REST API設計（Django Ninja）

| Method | エンドポイント | 説明 |
|--------|---------------|------|
| GET    | `/api/chords/` | コード一覧取得 |
| POST   | `/api/chords/` | コード新規登録 |
| GET    | `/api/chords/{id}/` | コード詳細取得 |
| PUT    | `/api/chords/{id}/` | コード更新 |
| DELETE | `/api/chords/{id}/` | コード削除 |
| GET    | `/api/chords/random/` | ランダム未習得コードを取得 |
| POST   | `/api/chords/{id}/toggle-mastered/` | 習得状況切替 |
| GET    | `/api/tags/` | タグ一覧取得 |
| POST   | `/api/tags/` | タグ新規登録 |
| PUT    | `/api/tags/{id}/` | タグ更新 |
| DELETE | `/api/tags/{id}/` | タグ削除 |
| GET    | `/api/stats/progress/` | 学習進捗データ取得 |

詳細なリクエスト・レスポンス構造は実装時のAPIドキュメントを参照。
