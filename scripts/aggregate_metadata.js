#!/usr/bin/env node
/**
 * RDF Config リポジトリからメタデータを取得して、JSONファイルを生成するスクリプト
 */

const fs = require("fs");
const path = require("path");
const git = require("isomorphic-git");
const http = require("node:http");
const RDF_CONFIG_REPO = "https://github.com/dbcls/rdf-config.git";

// GitHub API の設定
const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "dbcls";
const REPO_NAME = "rdf-config";
const CONFIG_PATH = "config";

async function cloneRepo() {
  await git.clone({
    fs: fs,
    http, // You'll need an HTTP client implementation for fetching remote data
    dir: path.join(__dirname, REPO_NAME), // The directory within the virtual file system
    url: RDF_CONFIG_REPO,
    // corsProxy: 'https://cors.isomorphic-git.org' // If cloning from a browser with CORS issues
  });
}

/**
 * 簡単なYAMLパーサー（必要なフィールドのみ）
 */
function parseYaml(yamlContent) {
  const lines = yamlContent.split("\n");
  const result = {
    title: "",
    description: "",
    tags: [],
  };

  let currentKey = null;
  let inTags = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("title:")) {
      result.title = trimmed
        .replace("title:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
    } else if (trimmed.startsWith("description:")) {
      result.description = trimmed
        .replace("description:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
    } else if (trimmed.startsWith("tags:")) {
      const tagsLine = trimmed.replace("tags:", "").trim();

      // Handle inline array format: tags: [item1, item2]
      if (tagsLine.startsWith("[") && tagsLine.endsWith("]")) {
        const tagsContent = tagsLine.slice(1, -1).trim();
        if (tagsContent) {
          result.tags = tagsContent
            .split(",")
            .map((tag) => tag.trim().replace(/^["']|["']$/g, ""));
        }
        inTags = false;
      } else if (tagsLine === "") {
        // Handle multiline array format
        inTags = true;
        result.tags = [];
      } else {
        inTags = false;
      }
    } else if (inTags && trimmed.startsWith("- ")) {
      const tag = trimmed
        .replace("- ", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      if (tag) result.tags.push(tag);
    } else if (
      inTags &&
      trimmed &&
      !trimmed.startsWith(" ") &&
      !trimmed.startsWith("-")
    ) {
      inTags = false;
    }
  }

  return result;
}

/**
 * 必要なフィールドを抽出
 */
function extractRequiredFields(metadata) {
  if (!metadata) {
    return {
      title: "",
      description: "",
      tags: [],
    };
  }

  return {
    title: metadata.title || "",
    description: metadata.description || "",
    tags: metadata.tags || [],
  };
}

function getMetadataFromClonedRepo(id) {
  const metadataPath = path.join(
    __dirname,
    REPO_NAME,
    CONFIG_PATH,
    id,
    "metadata.yaml",
  );

  try {
    const metadata = fs.readFileSync(metadataPath, "utf8");

    return extractRequiredFields(parseYaml(metadata));
  } catch (error) {
    return extractRequiredFields(null);
  }
}

async function getDatasetIdsFromClonedRepo() {
  try {
    const clonedRepoPath = path.join(__dirname, REPO_NAME, CONFIG_PATH);
    const datasetIds = await fs.promises.readdir(clonedRepoPath);

    return datasetIds;
  } catch (error) {
    return [];
  }
}

/**
 * メイン処理
 */
async function main() {
  const datasets = [];
  try {
    let ids = await getDatasetIdsFromClonedRepo();

    if (ids.length === 0) {
      console.log("No datasets found, cloning repo...");
      await cloneRepo();
      console.log(`Done`);

      ids = await getDatasetIdsFromClonedRepo();
    }

    for (const id of ids) {
      console.log(`Processing ${id}...`);
      const extracted = getMetadataFromClonedRepo(id);

      const datasetInfo = {
        id,
        ...extracted,
      };

      datasets.push(datasetInfo);

      if (extracted.title) {
        console.log(`✅ ${id}: ${extracted.title}`);
      } else {
        console.log(`⭕ ${id}: No metadata found`);
      }
    }

    // JSONファイルとして保存
    const outputFile = path.join(__dirname, "../_data/datasets_list.json");
    const outputDir = path.dirname(outputFile);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(datasets, null, 2), "utf-8");

    console.log(`\n🎉 Generated ${outputFile}`);
    console.log(`📊 Total datasets: ${datasets.length}`);

    // 統計情報
    const withMetadata = datasets.filter((d) => d.title).length;
    const withoutMetadata = datasets.length - withMetadata;

    console.log(`📈 With metadata: ${withMetadata}`);
    console.log(`📉 Without metadata: ${withoutMetadata}`);

    return;
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}
