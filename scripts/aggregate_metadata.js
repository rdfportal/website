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
    licenses: (() => {
      const rawLicenses = metadata.licenses || metadata.license || [];
      const licensesArray = Array.isArray(rawLicenses) ? rawLicenses : [rawLicenses];
      const normalized = [];
      let currentLicense = null;
      for (const lic of licensesArray) {
        if (typeof lic === "string") {
          currentLicense = { name: lic };
          normalized.push(currentLicense);
        } else if (lic && typeof lic === "object") {
           if (Object.keys(lic).length === 1 && (lic.url || lic.credit) && currentLicense) {
              Object.assign(currentLicense, lic);
           } else {
              currentLicense = { ...lic };
              normalized.push(currentLicense);
           }
        }
      }
      return normalized;
    })(),
    creators: (() => {
      const c = metadata.creators || metadata.creator || metadata.rdf_creators;
      if (typeof c === "string") {
        return [{ name: c, affiliation: null }];
      }
      return c || []; // Return array instead of object
    })(),
    website: metadata.website || null,
    issued: metadata.issued?.toString() || null,
    version: metadata.version?.toString() || null,
    rdf_provenance_type: metadata.rdf_provenance_type || null,
    registration_type: metadata.registration_type || null,
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
    rdf_provenance_type: null,
    registration_type: null,
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

    // Add rdf_provenance_type from metadata (preferably from English)
    if (metadata.rdf_provenance_type && !mergedMetadata.rdf_provenance_type) {
      mergedMetadata.rdf_provenance_type = metadata.rdf_provenance_type;
    }

    // Add registration_type from metadata (preferably from English)
    if (metadata.registration_type && !mergedMetadata.registration_type) {
      mergedMetadata.registration_type = metadata.registration_type;
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

  // Transform creators to an array of objects with localized strings
  // e.g., [{ name: { en: "Name", ja: "名前" }, affiliation: { en: "Affil", ja: "所属" } }]
  const localizedCreators = [];
  const maxCreators = Math.max(
    mergedMetadata.creators.en ? mergedMetadata.creators.en.length : 0,
    mergedMetadata.creators.ja ? mergedMetadata.creators.ja.length : 0
  );

  for (let i = 0; i < maxCreators; i++) {
    const enCreator = mergedMetadata.creators.en ? mergedMetadata.creators.en[i] : null;
    const jaCreator = mergedMetadata.creators.ja ? mergedMetadata.creators.ja[i] : null;

    if (!enCreator && !jaCreator) continue;

    const locCreator = { name: {}, affiliation: {} };
    if (enCreator) {
      if (enCreator.name) locCreator.name.en = enCreator.name;
      if (enCreator.affiliation) locCreator.affiliation.en = enCreator.affiliation;
    }
    if (jaCreator) {
      if (jaCreator.name) locCreator.name.ja = jaCreator.name;
      if (jaCreator.affiliation) locCreator.affiliation.ja = jaCreator.affiliation;
    }

    // Assign fallback values directly if they only exist in one language
    if (!locCreator.name.en && locCreator.name.ja) locCreator.name = locCreator.name.ja;
    else if (locCreator.name.en && !locCreator.name.ja) locCreator.name = locCreator.name.en;

    if (!locCreator.affiliation.en && locCreator.affiliation.ja) locCreator.affiliation = locCreator.affiliation.ja;
    else if (locCreator.affiliation.en && !locCreator.affiliation.ja) locCreator.affiliation = locCreator.affiliation.en;
    
    // Clean up empty objects
    if (Object.keys(locCreator.name).length === 0) delete locCreator.name;
    if (Object.keys(locCreator.affiliation).length === 0) delete locCreator.affiliation;

    localizedCreators.push(locCreator);
  }

  mergedMetadata.creators = localizedCreators;

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
 * Read SPARQL example files (query_<n>.rq) from a dataset directory
 * @param {string} id - Dataset ID
 * @returns {string[]} - Array of file contents ordered by n
 */
function readSparqlExamples(id) {
  const datasetDir = path.join(DATASETS_FOLDER, id);
  try {
    const files = fs.readdirSync(datasetDir);
    const rqFiles = files
      .map((file) => {
        const m = file.match(/^query_(\d+)\.rq$/i);
        if (!m) return null;
        return { file, n: parseInt(m[1], 10) };
      })
      .filter(Boolean)
      .sort((a, b) => a.n - b.n);

    const contents = rqFiles.map((f) => {
      try {
        return fs.readFileSync(path.join(datasetDir, f.file), "utf8");
      } catch (e) {
        return null;
      }
    }).filter((c) => c !== null);

    return contents;
  } catch (error) {
    return [];
  }
}

/**
 * Detect if a dataset has a schema.svg file
 * @param {String} id - Dataset ID
 * @returns {boolean} - True if schema.svg exists, false otherwise
 */
function detectSchemaSVG(id) {
  const datasetDir = path.join(DATASETS_FOLDER, id);

  try {
    const files = fs.readdirSync(datasetDir);
    return files.includes("schema.svg");
  } catch (error) {
    // Directory doesn't exist or can't be read
    return false;
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
      const isSchemaSVGPresent = detectSchemaSVG(id);

      const datasetInfo = {
        id,
        ...mergedMetadata,
        schema_svg: isSchemaSVGPresent,
        sparql_examples: readSparqlExamples(id),
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
