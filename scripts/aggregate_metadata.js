#!/usr/bin/env node
/**
 * RDF Config リポジトリからメタデータを取得して、JSONファイルを生成するスクリプト
 */

const fs = require("node:fs");
const path = require("node:path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const statJson = require("../_data/datasets_stats.json");

const RDF_CONFIG_REPO = "https://github.com/dbcls/rdf-config.git";

// GitHub API の設定

const REPO_NAME = "rdf-config";
const CONFIG_PATH = "config";

async function cloneRepo() {
  await git.clone({
    fs: fs,
    http, // HTTP client implementation for fetching remote data
    dir: path.join(__dirname, REPO_NAME), // The directory within the virtual file system
    url: RDF_CONFIG_REPO,
    depth: 1, // Shallow clone for better performance
    singleBranch: true, // Only clone the default branch
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
    licenses: [],
    creators: [],
    website: null,
    issued: null,
    version: null,
  };

  let currentKey = null;
  let inTags = false;
  let inLicense = false;
  let inLicenses = false;
  let currentLicense = {};
  let inCreators = false;
  let currentCreator = {};

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    if (trimmed.startsWith("title:")) {
      result.title = trimmed
        .replace("title:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
      inLicense = false;
      inLicenses = false;
    } else if (trimmed.startsWith("description:")) {
      result.description = trimmed
        .replace("description:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
      inLicense = false;
      inLicenses = false;
    } else if (trimmed.startsWith("provider:")) {
      // Added provider extraction
      result.provider = trimmed
        .replace("provider:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
      inLicense = false;
      inLicenses = false;
    } else if (trimmed.startsWith("website:")) {
      // Extract website URL
      result.website = trimmed
        .replace("website:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
      inLicense = false;
      inLicenses = false;
    } else if (trimmed.startsWith("issued:")) {
      // Extract issued date
      result.issued = trimmed
        .replace("issued:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
      inLicense = false;
      inLicenses = false;
    } else if (trimmed.startsWith("version:")) {
      // Extract version
      result.version = trimmed
        .replace("version:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
      inTags = false;
      inLicense = false;
      inLicenses = false;
    } else if (trimmed.startsWith("license:")) {
      const licenseLine = trimmed.replace("license:", "").trim();

      if (licenseLine === "") {
        // Multiline license object
        inLicense = true;
        inLicenses = false;
        inTags = false;
        currentLicense = {};
      } else if (
        licenseLine.startsWith("{") ||
        licenseLine.startsWith("name:") ||
        licenseLine.startsWith("url:") ||
        licenseLine.startsWith("credit:")
      ) {
        // Direct object format (not inside an array)
        inLicense = true;
        inLicenses = false;
        inTags = false;
        currentLicense = {};

        if (licenseLine.startsWith("name:")) {
          currentLicense.name = licenseLine
            .replace("name:", "")
            .trim()
            .replace(/^["']|["']$/g, "");
        } else if (licenseLine.startsWith("url:")) {
          currentLicense.url = licenseLine
            .replace("url:", "")
            .trim()
            .replace(/^["']|["']$/g, "");
        } else if (licenseLine.startsWith("credit:")) {
          currentLicense.credit = licenseLine
            .replace("credit:", "")
            .trim()
            .replace(/^["']|["']$/g, "");
        }
      } else {
        // Inline license, treat as a single license name
        result.licenses.push({
          name: licenseLine.replace(/^["']|["']$/g, ""),
          url: null,
          credit: null,
        });
      }
    } else if (trimmed.startsWith("licenses:")) {
      const licensesLine = trimmed.replace("licenses:", "").trim();

      if (licensesLine.startsWith("[") && licensesLine.endsWith("]")) {
        // Inline array format: licenses: [item1, item2]
        const licensesContent = licensesLine.slice(1, -1).trim();
        if (licensesContent) {
          const licenseNames = licensesContent
            .split(",")
            .map((license) => license.trim().replace(/^["']|["']$/g, ""));

          result.licenses = licenseNames.map((name) => ({
            name,
            url: null,
            credit: null,
          }));
        }
        inLicenses = false;
      } else {
        // Multiline licenses array
        inLicenses = true;
        inLicense = false;
        inTags = false;
      }
    } else if (inLicense && trimmed.startsWith("- name:")) {
      currentLicense.name = trimmed
        .replace("- name:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (inLicense && trimmed.startsWith("name:")) {
      currentLicense.name = trimmed
        .replace("name:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (inLicense && trimmed.startsWith("- url:")) {
      currentLicense.url = trimmed
        .replace("- url:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (inLicense && trimmed.startsWith("url:")) {
      currentLicense.url = trimmed
        .replace("url:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (inLicense && trimmed.startsWith("- credit:")) {
      currentLicense.credit = trimmed
        .replace("- credit:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (inLicense && trimmed.startsWith("credit:")) {
      currentLicense.credit = trimmed
        .replace("credit:", "")
        .trim()
        .replace(/^["']|["']$/g, "");

      // Complete license object after processing all fields
      if (Object.keys(currentLicense).length > 0) {
        result.licenses.push({
          name: currentLicense.name || null,
          url: currentLicense.url || null,
          credit: currentLicense.credit || null,
        });
        currentLicense = {};
      }
    } else if (trimmed.startsWith("creators:")) {
      const creatorsLine = trimmed.replace("creators:", "").trim();

      if (creatorsLine === "") {
        // Multiline creators array
        inCreators = true;
        inTags = false;
        inLicense = false;
        inLicenses = false;
      } else if (creatorsLine.startsWith("[") && creatorsLine.endsWith("]")) {
        // Inline array format: creators: [creator1, creator2]
        const creatorsContent = creatorsLine.slice(1, -1).trim();
        if (creatorsContent) {
          const creatorNames = creatorsContent
            .split(",")
            .map((creator) => creator.trim().replace(/^["']|["']$/g, ""));

          creatorNames.forEach((name) => {
            result.creators.push({
              name,
              affiliation: null,
            });
          });
        }
      } else {
        // Single creator as string
        result.creators.push({
          name: creatorsLine.replace(/^["']|["']$/g, ""),
          affiliation: null,
        });
      }
    } else if (inCreators && trimmed.startsWith("- name:")) {
      currentCreator.name = trimmed
        .replace("- name:", "")
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (inCreators && trimmed.startsWith("- affiliation:")) {
      currentCreator.affiliation = trimmed
        .replace("- affiliation:", "")
        .trim()
        .replace(/^["']|["']$/g, "");

      // After processing affiliation, add the complete creator object
      if (currentCreator.name) {
        result.creators.push({
          name: currentCreator.name,
          affiliation: currentCreator.affiliation || null,
        });
        currentCreator = {};
      }
    } else if (
      inCreators &&
      trimmed.startsWith("- ") &&
      !trimmed.includes(":")
    ) {
      // Handle direct array item (just a name without affiliation)
      const creatorName = trimmed
        .replace("- ", "")
        .trim()
        .replace(/^["']|["']$/g, "");

      if (creatorName) {
        result.creators.push({
          name: creatorName,
          affiliation: null,
        });
      }
    } else if (inLicenses && trimmed.startsWith("- ")) {
      // Handle licenses array format with dashes
      const licenseName = trimmed
        .replace("- ", "")
        .trim()
        .replace(/^["']|["']$/g, "");

      if (licenseName) {
        result.licenses.push({
          name: licenseName,
          url: null,
          credit: null,
        });
      }
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
        inLicense = false;
        inLicenses = false;
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

    // Check if we're entering a new section while in creators mode and have a pending creator
    if (
      inCreators &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith(" ") &&
      Object.keys(currentCreator).length > 0 &&
      currentCreator.name
    ) {
      result.creators.push({
        name: currentCreator.name,
        affiliation: currentCreator.affiliation || null,
      });
      currentCreator = {};
      inCreators = false;
    }

    // Check if we're entering a new section while in license mode
    if (
      inLicense &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith(" ") &&
      !trimmed.startsWith("name:") &&
      !trimmed.startsWith("url:") &&
      !trimmed.startsWith("credit:") &&
      Object.keys(currentLicense).length > 0
    ) {
      result.licenses.push({
        name: currentLicense.name || null,
        url: currentLicense.url || null,
        credit: currentLicense.credit || null,
      });
      currentLicense = {};
      inLicense = false;
    }
  }

  // Handle any remaining license object at the end of file
  if (inLicense && Object.keys(currentLicense).length > 0) {
    result.licenses.push({
      name: currentLicense.name || null,
      url: currentLicense.url || null,
      credit: currentLicense.credit || null,
    });
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
      licenses: [],
      creators: [],
      website: null,
      issued: null,
      version: null,
    };
  }

  return {
    title: metadata.title || "",
    description: metadata.description || "",
    provider: metadata.provider || "",
    tags: metadata.tags || [],
    licenses: metadata.licenses || [],
    creators: metadata.creators || [],
    website: metadata.website || null,
    issued: metadata.issued || null,
    version: metadata.version || null,
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
    licenses: [],
    creators: [],
    issued: null,
    website: null,
    version: null,
  };

  const providersByLang = {};

  for (const metadata of metadatas) {
    if (!metadata) continue;
    const lang = metadata.lang || "en";
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

    // Add licenses only once (preferably from English metadata)
    if (
      metadata.licenses &&
      metadata.licenses.length > 0 &&
      mergedMetadata.licenses.length === 0
    ) {
      mergedMetadata.licenses = metadata.licenses;
    }

    // Add creators only once (preferably from English metadata)
    if (
      metadata.creators &&
      metadata.creators.length > 0 &&
      mergedMetadata.creators.length === 0
    ) {
      mergedMetadata.creators = metadata.creators;
    }

    // Add website from metadata (preferably from English)
    if (metadata.website && !mergedMetadata.website) {
      mergedMetadata.website = metadata.website;
    }

    // Add issued date from metadata (preferably from English)
    if (metadata.issued && !mergedMetadata.issued) {
      mergedMetadata.issued = metadata.issued;
    }

    // Add version from metadata (preferably from English)
    if (metadata.version && !mergedMetadata.version) {
      mergedMetadata.version = metadata.version;
    }
  }

  // Create the providers array with multilingual entries
  if (Object.keys(providersByLang).length > 0) {
    mergedMetadata.providers = [providersByLang];
  }

  return mergedMetadata;
}

function getStatsForDatasetId(id) {
  const stat = statJson.find((s) => s.dataset === id);
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
    updated_at: stat?.updated_at || null,
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

    // Get the list of dataset IDs from the stats file
    const statsDatasetIds = statJson.map((item) => item.dataset);
    console.log(`Found ${statsDatasetIds.length} datasets in stats file`);

    // Filter dataset IDs to only include those present in the stats file
    ids = ids.filter((id) => statsDatasetIds.includes(id));
    console.log(
      `Processing ${ids.length} datasets that exist in stats file...`,
    );

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
        updated_at: statsData.updated_at,
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
