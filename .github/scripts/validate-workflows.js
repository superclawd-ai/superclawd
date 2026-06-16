const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

// Load the schema
const schemaPath = path.join(__dirname, 'workflow-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

// Find all JSON files in workflows directory
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
  const readmePath = path.join(process.cwd(), 'workflows', 'README.md');
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

// Check if workflow is listed in README catalog
function isWorkflowInCatalog(filePath, readmeContent) {
  if (!readmeContent) {
    return false;
  }

  // Get the relative path from workflows/ directory (e.g., "examples/bug-fix.json")
  const workflowsDir = path.join(process.cwd(), 'workflows');
  const relativePath = path.relative(workflowsDir, filePath);

  // Check if the file is referenced in the README
  return readmeContent.includes(relativePath);
}

// Validate edge indices reference valid nodes
function validateEdgeIndices(data) {
  const errors = [];
  const nodeCount = data.nodes.length;

  for (let i = 0; i < data.edges.length; i++) {
    const edge = data.edges[i];
    if (edge.sourceNodeIndex >= nodeCount) {
      errors.push(`Edge ${i}: sourceNodeIndex (${edge.sourceNodeIndex}) exceeds node count (${nodeCount})`);
    }
    if (edge.targetNodeIndex >= nodeCount) {
      errors.push(`Edge ${i}: targetNodeIndex (${edge.targetNodeIndex}) exceeds node count (${nodeCount})`);
    }
  }

  return errors;
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
    console.error(`     File names must be kebab-case (e.g., "my-workflow.json")`);
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
    // Additional validation for edge indices
    const edgeErrors = validateEdgeIndices(data);
    if (edgeErrors.length > 0) {
      console.error(`  ❌ Edge index validation errors:`);
      for (const error of edgeErrors) {
        console.error(`     - ${error}`);
      }
      return { schemaValid: false, inCatalog: false, validFileName };
    }

    console.log(`  ✅ Valid schema`);
    console.log(`     Name: ${data.name}`);
    console.log(`     Nodes: ${data.nodes.length}`);
    console.log(`     Edges: ${data.edges.length}`);
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
  const inCatalog = isWorkflowInCatalog(filePath, readmeContent);
  if (inCatalog) {
    console.log(`  ✅ Listed in catalog`);
  } else {
    console.error(`  ❌ Not listed in workflows/README.md catalog`);
    console.error(`     Please add your workflow to the "Available Workflows" section`);
  }

  return { schemaValid, inCatalog, validFileName };
}

// Main
const workflowsDir = path.join(process.cwd(), 'workflows');
const jsonFiles = findJsonFiles(workflowsDir);

if (jsonFiles.length === 0) {
  console.log('No JSON files found in workflows/ directory');
  process.exit(0);
}

const readmeContent = loadReadmeContent();

console.log(`Found ${jsonFiles.length} workflow file(s) to validate`);
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
    console.log('❌ File name validation failed - use kebab-case (e.g., "my-workflow.json")');
  }
  if (schemaErrors) {
    console.log('❌ Schema validation failed - please fix the errors above');
  }
  if (catalogErrors) {
    console.log('❌ Catalog check failed - please add missing workflows to workflows/README.md');
  }
  process.exit(1);
} else {
  console.log(`✅ All ${jsonFiles.length} workflow(s) are valid and listed in catalog`);
  process.exit(0);
}
