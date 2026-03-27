# RDF Portal Website

このリポジトリは、RDF Portal のウェブサイトのソースコードを管理しています。

### 1. ローカル開発環境の立ち上げ

本サイトは Jekyll を使用して構築されています。ローカルで動作確認を行いたい場合は、以下のコマンドを実行してください。

```bash
bundle install
bundle exec jekyll serve
```
ブラウザで `http://localhost:4000` にアクセスするとプレビューを確認できます。

### 2. ページの追加とナビゲーションの更新

#### 2-1. ページ追加の基本ルール（全体）
新しいページを追加する際は、以下の基本手順に従います。
1. プロジェクト内の適切なディレクトリ（例: `documents/` や `access_methods/` など）に新しい Markdown ファイル（`.md`）を作成します。
2. ファイルの冒頭に、必ずフロントマター（`---` で囲まれた部分）を記述し、最低限 `layout` と `title` を設定してください。
   ```yaml
   ---
   layout: page
   title: "ページのタイトル"
   ---
   ```
3. その下に、ページの本文を Markdown 形式で記述します。

#### 2-2. 各ディレクトリごとの分類（各論）
- **`documents/` 配下**: マニュアルや RDF config などの文書ページを格納します。
- **`access_methods/` 配下**: SPARQL や GraphQL 等の各種 API、インターフェースの説明ページを格納します。

#### 2-3. メニュー（ナビゲーション）への追加方法
新しく作成したページへの導線をサイト上部の共通メニューなどに表示させるには、`_data/navigation/` 配下のデータファイル（日本語は `ja.yml`、英語は `en.yml`）を編集します。

既存のリスト構成（`- id:` から始まるブロック）に倣って追記してください。

**例1: 特定のメニューの「サブメニュー」として追加する場合**
例えば「ドキュメント」の中に新しいページを追加したい場合は、以下のように `children:` の下に記述します。
```yaml
- id: documents
  title: "ドキュメント"
  url: "/documents/manual/"
  children:
    - id: manual
      title: "マニュアル"
      url: "/documents/manual/"
    - id: new_document  # ← 【追加箇所】一意のID
      title: "新しい文書"     # 【追加箇所】メニューに表示される日本語（英語）
      url: "/documents/new_doc/" # 【追加箇所】作成したページのURL
```

**例2: メインのトップメニューとして新しく独立させる場合**
```yaml
- id: new_feature  # ← YAMLの末尾などに独立して追加
  title: "新機能"
  url: "/new_feature_page/"
```

※ サイトは多言語対応になっています。メニューに新しい項目を追加する際は、**必ず `ja.yml` と `en.yml` の両方**に同じ構造で追記するようにしてください。

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
