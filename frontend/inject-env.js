#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ler a variável de ambiente da API
const apiUrl = process.env.API_URL || process.env.RENDER_EXTERNAL_URL || 'https://snapbot-backend.onrender.com/api';

// Caminho do index.html após o build
const indexPath = path.join(__dirname, 'dist', 'snapbot-frontend', 'index.html');

if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    // Injetar a variável antes do fechamento do </head>
    const scriptTag = `
    <script>
        window.__API_URL__ = '${apiUrl}';
    </script>`;

    indexContent = indexContent.replace('</head>', scriptTag + '\n    </head>');

    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`✅ Variável API_URL injetada: ${apiUrl}`);
} else {
    console.error(`❌ Arquivo não encontrado: ${indexPath}`);
    process.exit(1);
}

