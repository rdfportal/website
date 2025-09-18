#!/usr/bin/env node
/**
 * RDF Config リポジトリからメタデータを取得して、JSONファイルを生成するスクリプト
 */

const fs = require("node:fs");
const path = require("node:path");
const git = require("isomorphic-git");
const http = require("node:http");
const statJson = require("../_data/datasets_stats.json");

const RDF_CONFIG_REPO = "https://github.com/dbcls/rdf-config.git";

// GitHub API の設定

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
 * 正しくないYAMLファイルあったりするので、このような手動のYAMLのパースが必要
 */
function parseYaml(yamlContent) {
  const lines = yamlContent.split("\n");
  const result = {
    title: "",
    description: "",
    tags: [],
    provider: "",
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
    } else if (trimmed.startsWith("provider:")) {
      // Added provider extraction
      result.provider = trimmed
        .replace("provider:", "")
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
      provider: "",
      tags: [],
    };
  }

  return {
    title: metadata.title || "",
    description: metadata.description || "",
    provider: metadata.provider || "",
    tags: metadata.tags || [],
  };
}

function getMetadataFromClonedRepo(id, lang) {
  const metadataPath = path.join(
    __dirname,
    REPO_NAME,
    CONFIG_PATH,
    id,
    lang ? `metadata_${lang}.yaml` : "metadata.yaml",
  );

  try {
    const metadata = fs.readFileSync(metadataPath, "utf8");
    return {
      exists: true,
      metadata: extractRequiredFields(parseYaml(metadata)),
    };
  } catch (error) {
    return {
      exists: false,
      metadata: extractRequiredFields(null),
    };
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

function mergeMultilanguageExtractedMetadata(...metadatas) {
  const mergedMetadata = {
    title: "",
    description: {},
    providers: [],
    tags: [],
  };

  const providersByLang = {};

  for (const metadata of metadatas) {
    const lang = metadata.lang || "en";

    if (!metadata) continue;

    // Set title only once (preferably from English)
    if (!mergedMetadata.title && metadata.title) {
      mergedMetadata.title = metadata.title;
    }

    // Add description for this language
    if (metadata.description) {
      mergedMetadata.description[lang] = metadata.description;
    }

    if (metadata.provider) {
      providersByLang[lang] = metadata.provider;
    }

    // Merge tags
    if (metadata.tags && metadata.tags.length > 0) {
      mergedMetadata.tags = [
        ...new Set([...mergedMetadata.tags, ...metadata.tags]),
      ];
    }
  }

  // Create the providers array with multilingual entries
  if (Object.keys(providersByLang).length > 0) {
    mergedMetadata.providers = [providersByLang];
  }

  return mergedMetadata;
}

function getStatsForDatasetId(id) {
  const stat = statJson.find((s) => s.id === id);
  return {
    statistics: stat?.statistics || {
      number_of_triples: 0,
      number_of_instances: 0,
      number_of_subjects: 0,
      number_of_properties: 0,
      number_of_objects: 0,
      number_of_literals: 0,
      number_of_classes: 0,
      number_of_datatypes: 0,
      number_of_links: 0,
    },
    endpoint: stat?.endpoint || "",
  };
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
      const extractedResult = getMetadataFromClonedRepo(id);
      const hasMetadata = extractedResult.exists;
      const extracted = extractedResult.metadata;
      extracted.lang = "en";

      const extractedJaResult = getMetadataFromClonedRepo(id, "ja");
      const extractedJa = extractedJaResult.metadata;
      extractedJa.lang = "ja";

      if (!hasMetadata) {
        console.log(`⭕ ${id}: No metadata.yaml found - skipping`);
        continue;
      }

      const mergedMetadata = mergeMultilanguageExtractedMetadata(
        extracted,
        extractedJa,
      );

      const statsData = getStatsForDatasetId(id);
      const datasetInfo = {
        id,
        ...mergedMetadata,
        statistics: statsData.statistics,
        endpoint: statsData.endpoint,
      };

      datasets.push(datasetInfo);

      if (extracted.title) {
        console.log(`✅ ${id}: ${extracted.title}`);
      } else {
        console.log(`⭕ ${id}: Metadata file exists but no title found`);
      }
    }

    // JSONファイルとして保存
    const outputFile = path.join(__dirname, "../_data/datasets.json");
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
