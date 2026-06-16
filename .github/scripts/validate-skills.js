const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

// Load the schema
const schemaPath = path.join(__dirname, 'skill-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

// Find all JSON files in skills directory
function findJsonFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Load README content for catalog check
function loadReadmeContent() {
  const readmePath = path.join(process.cwd(), 'skills', 'README.md');
  if (!fs.existsSync(readmePath)) {
    return null;
  }
  return fs.readFileSync(readmePath, 'utf8');
}

// Validate file name is kebab-case
function isValidFileName(filePath) {
  const fileName = path.basename(filePath, '.json');
  // kebab-case: lowercase letters, numbers, and hyphens only
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return kebabCaseRegex.test(fileName);
}

// Check if skill is listed in README catalog
function isSkillInCatalog(filePath, readmeContent) {
  if (!readmeContent) {
    return false;
  }

  // Get the relative path from skills/ directory (e.g., "examples/react-best-practices.json")
  const skillsDir = path.join(process.cwd(), 'skills');
  const relativePath = path.relative(skillsDir, filePath);

  // Check if the file is referenced in the README
  return readmeContent.includes(relativePath);
}

// Validate a single file
function validateFile(filePath, readmeContent) {
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath);

  console.log(`\nValidating: ${relativePath}`);

  // Check file name format
  const validFileName = isValidFileName(filePath);
  if (validFileName) {
    console.log(`  ✅ Valid file name (kebab-case)`);
  } else {
    console.error(`  ❌ Invalid file name: "${fileName}"`);
    console.error(`     File names must be kebab-case (e.g., "my-awesome-skill.json")`);
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`  ❌ Failed to read file: ${err.message}`);
    return { schemaValid: false, inCatalog: false, validFileName: false };
  }

  let data;
  try {
    data = JSON.parse(content);
  } catch (err) {
    console.error(`  ❌ Invalid JSON: ${err.message}`);
    return { schemaValid: false, inCatalog: false, validFileName };
  }

  const schemaValid = validate(data);

  if (schemaValid) {
    console.log(`  ✅ Valid schema`);
    console.log(`     Name: ${data.name}`);
    console.log(`     Action: ${data.action}`);
    console.log(`     Categories: ${data.categories.length}`);
    const instructionCount = data.categories.reduce((sum, cat) => sum + cat.instructions.length, 0);
    console.log(`     Instructions: ${instructionCount}`);
  } else {
    console.error(`  ❌ Schema validation errors:`);
    for (const error of validate.errors) {
      const location = error.instancePath || '(root)';
      console.error(`     - ${location}: ${error.message}`);
      if (error.params) {
        const params = Object.entries(error.params)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
        console.error(`       (${params})`);
      }
    }
  }

  // Check catalog listing
  const inCatalog = isSkillInCatalog(filePath, readmeContent);
  if (inCatalog) {
    console.log(`  ✅ Listed in catalog`);
  } else {
    console.error(`  ❌ Not listed in skills/README.md catalog`);
    console.error(`     Please add your skill to the "Available Skills" section`);
  }

  return { schemaValid, inCatalog, validFileName };
}

// Main
const skillsDir = path.join(process.cwd(), 'skills');
const jsonFiles = findJsonFiles(skillsDir);

if (jsonFiles.length === 0) {
  console.log('No JSON files found in skills/ directory');
  process.exit(0);
}

const readmeContent = loadReadmeContent();

console.log(`Found ${jsonFiles.length} skill file(s) to validate`);
console.log('='.repeat(50));

let schemaErrors = false;
let catalogErrors = false;
let fileNameErrors = false;

for (const file of jsonFiles) {
  const { schemaValid, inCatalog, validFileName } = validateFile(file, readmeContent);
  if (!schemaValid) {
    schemaErrors = true;
  }
  if (!inCatalog) {
    catalogErrors = true;
  }
  if (!validFileName) {
    fileNameErrors = true;
  }
}

console.log('\n' + '='.repeat(50));

if (schemaErrors || catalogErrors || fileNameErrors) {
  if (fileNameErrors) {
    console.log('❌ File name validation failed - use kebab-case (e.g., "my-skill.json")');
  }
  if (schemaErrors) {
    console.log('❌ Schema validation failed - please fix the errors above');
  }
  if (catalogErrors) {
    console.log('❌ Catalog check failed - please add missing skills to skills/README.md');
  }
  process.exit(1);
} else {
  console.log(`✅ All ${jsonFiles.length} skill(s) are valid and listed in catalog`);
  process.exit(0);
}
