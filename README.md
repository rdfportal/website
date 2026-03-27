# RDF Portal Website

このリポジトリは、RDF Portal のウェブサイトのソースコードを管理しています。

## サイトの更新・運用について

担当者が変わった場合でもスムーズにサイトの更新や運用ができるよう、以下の基本事項を確認してください。

### 1. ローカル開発環境の立ち上げ

本サイトは Jekyll を使用して構築されています。ローカルで動作確認を行いたい場合は、以下のコマンドを実行してください。

```bash
bundle install
bundle exec jekyll serve
```
ブラウザで `http://localhost:4000` にアクセスするとプレビューを確認できます。

### 2. ページの追加と編集

- **documents へのページ追加**:
  - `documents/` ディレクトリ配下に新しい Markdown ファイル（例: `new_doc.md`）を作成します。
  - ファイル冒頭のフロントマター（`---` で囲まれた部分）に `layout: page` や `title: ページ名` 等を設定します。
- **access_methods へのページ追加**:
  - `access_methods/` ディレクトリ配下に新しい Markdown ファイルを作成します。
  - フロントマターを適切に設定し、必要に応じて `_data/navigation/ja.yml` や `en.yml` 等にナビゲーション用のリンクを追加してください。

### 3. お知らせ (announce) と更新履歴 (update log) の追加

- **お知らせ (announce) の追加**:
  - お知らせページ (`announcements.md`) に直接内容を追記します。
- **更新履歴 (update log) の追加**:
  - 更新履歴ページ (`update-log.md`) に新しい更新の概要や日付などを追記します。

### 4. 本番へのデプロイ (GitHub Actions の実行方法)

本サイトの各種ビルドとデプロイメントは、GitHub Actions を通じて自動・手動で行うことができます。

- **自動デプロイ**: 
  - `main` ブランチに変更が `push` されるか、Pull Request がマージされると自動的に `Build site` ワークフローが起動し、GitHub Pages に反映されます。
- **手動デプロイ**: 
  - GitHub リポジトリの [Actions] タブを開き、左メニューの `Build site` を選択します。
  - 右側の `Run workflow` ボタンをクリックし、`main` ブランチを指定して実行することで、任意のタイミングで手動デプロイが可能です。

---

※ **AI 等への指示書・今後の実装仕様に関する記録**については、`_ai_docs/AI_instructions.md` を参照してください。
