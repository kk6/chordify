# GitHub Projects 運用ガイド

このドキュメントでは、Chordifyリポジトリにおける **GitHub Projects** の運用ルール・自動化設定・活用方法についてまとめます。

## 目次
- [📌 カラム構成](#-カラム構成)
- [🏷️ ラベル運用](#-ラベル運用)
- [🤖 自動化設定](#-自動化設定)
  - [自動処理内容](#自動処理内容)
  - [使用Secret](#使用secret)
- [📅 週次進捗レポート](#-週次進捗レポート)
- [🚀 運用ルール](#-運用ルール)
- [📄 参考ファイル](#-参考ファイル)
- [🙌 補足](#-補足)

---

## 📌 カラム構成

プロジェクトは **Kanbanテンプレート** を拡張し、以下の7つのカラムで構成されています。

| カラム名       | 用途                                           |
|------------|--------------------------------------------------|
| Backlog   | 未検討・保留中のタスク                             |
| Discussion | 検討中・議論中のタスク                             |
| Ready     | 着手準備OKのタスク（検討済み）                     |
| In progress | 作業中のタスク（Assigneeが設定された時に移動）    |
| Blocked   | 他タスクや外部要因で一時停止しているタスク         |
| In review | PR作成時に自動で移動                               |
| Done      | 完了したタスク（PRマージ時に自動で移動）           |

---

## 🏷️ ラベル運用

タスクの種別・優先度・状態・担当領域を明確化するため、**prefix付きラベル** を運用しています。

詳細は [Issueラベル一覧](./09_labels.md) を参照してください。

---

## 🤖 自動化設定

### 自動処理内容

| イベント | 自動処理 |
|---------|------------------------------------------------------------|
| Issue作成 | Projectに追加 → `Backlog` へ配置 |
| `status:ready` ラベル付与 | `Ready` へ移動 |
| `status:blocked` ラベル付与 | `Blocked` へ移動 |
| Assignee設定 | `In progress` へ移動 |
| PR作成（本文に `Closes #X`） | 該当Issueを `In review` へ移動 |
| PRマージ | 関連Issueを `Done` へ移動 |

### 使用Secret

- `PAT_PROJECT_AUTOMATION`
  → Projects v2操作用 Personal Access Token（classic）を登録

---

## 📅 週次進捗レポート

`Weekly Progress Report` workflow により、**毎週月曜9:00 (UTC)** に以下の進捗レポートが指定のIssueに自動投稿されます。

### レポート内容

- 直近1週間で **クローズされたIssue数**
- **マージされたPR数**
- **新規Issue数**
- アクティブなマイルストーンの進捗状況
- Projectカラムごとのタスク数

---

## 🚀 運用ルール

- **新しいIssue作成時** → 自動で `Backlog` に追加
- **技術検討が必要な場合** → `type:discussion` ラベルを付与し `Discussion` カラムに移動
- **着手準備が整ったら** → `status:ready` ラベルを付与
- **依存タスク等で保留にする場合** → `status:blocked` ラベルを付与し `Blocked` カラムへ移動
- **PR作成時は** → 本文に `Closes #X` を記載
- **完了時は** → PRマージで `Done` へ自動移動
- **週次進捗レポート** → Issueコメントに自動投稿

---

## 📄 参考ファイル

- `.github/workflows/project-automation.yml`
  → Projects連携の自動化設定
- `.github/workflows/weekly-progress-report.yml`
  → 週次進捗レポート生成

---

## 🙌 補足

本ガイドは **個人開発環境向け** に最適化されています。
チーム運用時には更なる自動化や権限管理の強化も可能です。
