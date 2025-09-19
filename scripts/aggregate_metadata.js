#!/usr/bin/env node
/**
 * RDF Config リポジトリからメタデータを取得して、JSONファイルを生成するスクリプト
 */

const fs = require("node:fs");
const path = require("node:path");

const statJson = require("../_data/datasets_stats.json");

const DATASETS_FOLDER = path.join(__dirname, "..", "assets", "datasets");

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
      creators: {},
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
    creators:
      typeof metadata.creators === "string"
        ? [{ name: metadata.creators, affiliation: null }]
        : metadata.creators || {},
    website: metadata.website || null,
    issued: metadata.issued || null,
    version: metadata.version || null,
  };
}

function getMetadataFromLocalFolder(id, lang) {
  const metadataPath = path.join(
    DATASETS_FOLDER,
    id,
    lang ? `metadata_${lang}.yaml` : "metadata.yaml",
  );

  try {
    const metadata = fs.readFileSync(metadataPath, "utf8");
    return {
      exists: true,
      metadata: extractRequiredFields(Bun.YAML.parse(metadata)),
    };
  } catch (error) {
    return {
      exists: false,
      metadata: extractRequiredFields(null),
    };
  }
}

function mergeMultilanguageExtractedMetadata(...metadatas) {
  const mergedMetadata = {
    title: "",
    description: {},
    providers: [],
    tags: [],
    licenses: [],
    creators: {},
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

    // Add creators by language
    if (metadata.creators) {
      // Handle case where creators is a string instead of an array of objects
      if (typeof metadata.creators === "string") {
        mergedMetadata.creators[lang] = [
          {
            name: metadata.creators,
            affiliation: null,
          },
        ];
      } else if (
        Array.isArray(metadata.creators) &&
        metadata.creators.length > 0
      ) {
        mergedMetadata.creators[lang] = metadata.creators;
      }
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
    // Ensure both en and ja keys exist
    if (providersByLang.en && !providersByLang.ja) {
      providersByLang.ja = providersByLang.en;
    } else if (providersByLang.ja && !providersByLang.en) {
      providersByLang.en = providersByLang.ja;
    }
    mergedMetadata.providers = [providersByLang];
  }

  // Ensure description has both en and ja keys
  if (mergedMetadata.description.en && !mergedMetadata.description.ja) {
    mergedMetadata.description.ja = mergedMetadata.description.en;
  } else if (mergedMetadata.description.ja && !mergedMetadata.description.en) {
    mergedMetadata.description.en = mergedMetadata.description.ja;
  }

  // Ensure creators has both en and ja keys
  if (mergedMetadata.creators.en && !mergedMetadata.creators.ja) {
    mergedMetadata.creators.ja = mergedMetadata.creators.en;
  } else if (mergedMetadata.creators.ja && !mergedMetadata.creators.en) {
    mergedMetadata.creators.en = mergedMetadata.creators.ja;
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
 * Count the number of SPARQL example files (.rq) in a dataset directory
 * @param {string} id - Dataset ID
 * @returns {number} - Number of .rq files found
 */
function countSparqlExamples(id) {
  const datasetDir = path.join(DATASETS_FOLDER, id);

  try {
    const files = fs.readdirSync(datasetDir);
    const rqFiles = files.filter((file) => file.endsWith(".rq"));
    return rqFiles.length;
  } catch (error) {
    // Directory doesn't exist or can't be read
    return 0;
  }
}

/**
 * メイン処理
 */
async function main() {
  const datasets = [];
  try {
    const statsDatasetIds = statJson.map((item) => item.dataset);
    console.log(`Found ${statsDatasetIds.length} datasets in stats file`);

    for (const id of statsDatasetIds) {
      console.log(`Processing ${id}...`);
      const extractedResult = getMetadataFromLocalFolder(id);

      const hasMetadata = extractedResult.exists;
      const extracted = extractedResult.metadata;
      extracted.lang = "en";

      const extractedJaResult = getMetadataFromLocalFolder(id, "ja");
      const hasJaMetadata = extractedJaResult.exists;
      const extractedJa = extractedJaResult.metadata;
      extractedJa.lang = "ja";

      if (!hasMetadata) {
        console.log(`⭕ ${id}: No metadata.yaml found - skipping`);
        continue;
      }

      // If no Japanese metadata exists, copy all English values to Japanese
      if (!hasJaMetadata) {
        console.log(
          `ℹ️ ${id}: No Japanese metadata found, using English values`,
        );
        if (extracted.creators) {
          extractedJa.creators = extracted.creators;
        }
        if (extracted.description) {
          extractedJa.description = extracted.description;
        }
        if (extracted.provider) {
          extractedJa.provider = extracted.provider;
        }
      }

      const mergedMetadata = mergeMultilanguageExtractedMetadata(
        extracted,
        extractedJa,
      );

      const statsData = getStatsForDatasetId(id);
      const sparqlCount = countSparqlExamples(id);

      const datasetInfo = {
        id,
        ...mergedMetadata,
        sparql_examples_count: sparqlCount,
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
