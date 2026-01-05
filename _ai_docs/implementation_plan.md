# 実装計画

## プロジェクトの制約 (GitHub Pages)
このプロジェクトは **GitHub Pages** での動作を前提としています。
1.  **プラグイン**: 標準サポート外のプラグイン（`jekyll-polyglot`等）を使用するため、**GitHub Actions** によるビルドとデプロイを行います。
2.  **環境**: GitHub Actions 上で Jekyll ビルドプロセスを実行し、静的ファイルを `gh-pages` ブランチ等にデプロイする構成とします。
3.  **動的機能**: サーバーサイドコード（PHP, Ruby on Rails等）は使用不可。クライアントサイドJSのみ。

---

## 提案する変更: 言語切り替え機能 (`default.html`)
現在、`default.html` の言語切り替えリンクは `page.permalink_lang` という独自の Frontmatter 定義に依存しており、これが定義されていないページでは切り替えボタンが表示されないか、機能しません。
これを `jekyll-polyglot` の標準的な挙動に合わせて汎用化します。

### 変更内容

#### `_layouts/default.html`
現在の `{% if page.permalink_lang %}` ブロックを修正し、以下のロジックを追加・変更します：
1.  **汎用的なリンク生成**: Frontmatter に定義がなくても、現在の URL (`page.url`) を基に対訳ページの URL を自動生成します。
    *   EN -> JA: `/website/` -> `/website/ja/`
    *   JA -> EN: `/website/ja/` -> `/website/`
2.  **既存ロジックの維持**: `permalink_lang` が明示的にある場合はそれを優先します（`index.md` のような特殊なパス用）。

### 検証計画
1.  `permalink_lang` がないページ（例: `datasets.md`）を開き、言語切り替えリンクが表示されるか確認。
2.  リンクをクリックして、正しい言語のページ (`/website/ja/datasets/` 等) に遷移するか確認。

## 提案する変更: 各ページの多言語化

### 対象ページ
ユーザーの要望に応じ、順次対応します。
1.  `datasets.md`
2.  `access_methods/` 配下のページ
3.  `statistics.md` (確認)

### 方法
ページの内容に応じて、以下のいずれかの方法を採用します。
*   **方法A**: 1つのファイル内で `{% lang en %}...{% endlang %}` タグを使用（小規模な変更で済む場合）。
*   **方法B**: `filename.en.md` と `filename.ja.md` に分割（コンテンツ量が大きく異なる場合）。

---

*現在、開発タスク待ちです。*

---

*現在、開発タスク待ちです。*
