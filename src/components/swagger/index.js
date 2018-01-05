import fs from 'fs';
import path from 'path';
import ui from 'swagger-ui-express';

import config from '../../config';

// Load swagger spec
const filePath = path.join(config.root, 'docs', 'swagger.json');
const doc = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Swagger options
const showExplorer = false;

export default {
  serve: () => ui.serve,
  setup: () => ui.setup(doc, showExplorer),
};
