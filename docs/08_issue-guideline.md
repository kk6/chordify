# 🗂️ Issue運用ガイドライン

本リポジトリにおけるIssueの運用方針を以下に定めます。

## 🎯 Issue種別とテンプレート

| 種別            | 説明                               | テンプレートファイル          |
|---------------|------------------------------------|-------------------------------|
| 🐞 Bug Report | 不具合報告用                         | `.github/ISSUE_TEMPLATE/bug_report.yml` |
| 🚀 Feature Request | 機能追加・改善提案用           | `.github/ISSUE_TEMPLATE/feature_request.yml` |
| 📝 Task      | 通常作業タスク用                     | `.github/ISSUE_TEMPLATE/task.yml` |
| 💬 Discussion| 検討・相談用（AIへの相談含む）      | `.github/ISSUE_TEMPLATE/discussion.yml` |

> 🚫 Blank Issue は無効化しています。

---

## 🏷️ ラベル運用ルール

### プレフィックス

ラベル名には以下の4つのプレフィックスを使用します。

| プレフィックス | 用途            | 例 |
|--------------|---------------|---------------------------|
| `priority:` | 優先度         | `priority: high` / `priority: low` |
| `status:`   | 状態           | `status: ready` / `status: blocked` |
| `type:`     | 種別           | `type: bug` / `type: feature` |
| `area:`     | 対象領域       | `area: api` / `area: frontend` |

ラベル一覧は [Issueラベル一覧](./09_labels.md) を参照してください。

---

## 📌 プロジェクトボード運用

GitHub Projects v2 にて以下のカラムを使用します。

| カラム名        | 用途                           |
|--------------|-------------------------------|
| Backlog     | 対応予定だが未着手のIssue      |
| Ready      | 対応準備が整ったIssue         |
| In progress| 作業中のIssue                 |
| In review  | 実装済・レビュー待ちのIssue    |
| Done      | 完了したIssue                  |
| Discussion | 検討中・議論中のIssue          |
| Blocked    | 他のIssue等により停滞中のIssue |

---

## 📄 Issue作成時の注意

- **必ずテンプレートを使用すること**
- **背景・目的を明記すること**
- **必要に応じてラベルを適切に設定すること**
- **複数の課題を1Issueにまとめないこと（原則1Issue1トピック）**

---

## 🤖 AI活用について

当プロジェクトでは、**Copilot, ChatGPT 等のAIツール**を **レビュー・ディスカッションパートナー**として積極的に活用します。  
**Discussion Issue** を活用し、検討ログを残すことを推奨します。
