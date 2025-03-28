# 🏷️ Issueラベル一覧

本リポジトリで使用するIssueラベルの一覧と運用ルールを記載します。

---

## 🎯 プレフィックス規則

| プレフィックス | 用途          | 例                     |
|:--------------:|:------------:|:---------------------:|
| `priority:`   | 優先度      | `priority: high` / `priority: low` |
| `status:`     | 状態        | `status: ready` / `status: blocked` |
| `type:`       | 種別        | `type: bug` / `type: feature` |
| `area:`       | 対象領域    | `area: api` / `area: frontend` |

---

## 📌 ラベル一覧

### 優先度ラベル

| ラベル名          | 説明                     |
|-------------------|-------------------------|
| `priority: high`  | 優先的に対応すべきIssue |
| `priority: medium`| 通常優先度のIssue       |
| `priority: low`   | 優先度の低いIssue       |

---

### 状態ラベル

| ラベル名             | 説明                       |
|----------------------|----------------------------|
| `status: ready`      | 対応準備が整ったIssue     |
| `status: blocked`    | 他Issue等により停滞中     |
| `status: discussion` | 検討・議論中のIssue       |

---

### 種別ラベル

| ラベル名          | 説明                   |
|-------------------|----------------------|
| `type: bug`      | 不具合                 |
| `type: feature`  | 機能追加・改善         |
| `type: refactor` | リファクタリング       |
| `type: testing`  | テスト関連             |
| `type: chore`    | 雑務・細かい作業       |
| `type: ci`       | CI関連                 |
| `type: documentation` | ドキュメント関連 |

---

### 対象領域ラベル

| ラベル名          | 説明               |
|-------------------|------------------|
| `area: api`      | API開発           |
| `area: backend`  | バックエンド全般  |
| `area: frontend` | フロントエンド    |
| `area: infra`    | インフラ関連      |

---

## 🚫 補足

- ラベルは **必要に応じて追加・削除・改名可**
- 可能な限り **1Issueにつき最低1つは `type:` ラベル** を付与
- 状態ラベル（ `status:` ）は **基本1つのみ付与**
- **優先度・対象領域** は **必要に応じて付与**
