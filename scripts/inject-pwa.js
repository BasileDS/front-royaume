#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist');
const publicPath = path.join(__dirname, '../public');
const indexPath = path.join(distPath, 'index.html');

// Lire le fichier HTML
let html = fs.readFileSync(indexPath, 'utf8');

// Meta tags PWA à ajouter
const pwaTags = `
  <!-- PWA Configuration -->
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Royaume" />
  <meta name="theme-color" content="#1a1a1a" />
  <meta name="msapplication-TileColor" content="#1a1a1a" />
  <meta name="msapplication-navbutton-color" content="#1a1a1a" />
  <meta name="application-name" content="Royaume Paraiges" />
  <meta name="description" content="Application officielle du Royaume des Paraiges - Découvrez les meilleures bières et établissements" />
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Apple Touch Icons -->
  <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
`;

// Scripts PWA à ajouter avant </body>
const pwaScripts = `
  <!-- PWA Scripts -->
  <script src="/pwa-install.js"></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            console.log('SW registered:', registration);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      });
    }
  </script>
`;

// Injecter les meta tags après <head>
html = html.replace('<head>', '<head>' + pwaTags);

// Injecter les scripts avant </body>
html = html.replace('</body>', pwaScripts + '</body>');

// Écrire le fichier modifié
fs.writeFileSync(indexPath, html);

console.log('✅ PWA meta tags and scripts injected successfully!');

// Faire la même chose pour tous les autres fichiers HTML
const files = fs.readdirSync(distPath);
files.forEach(file => {
  if (file.endsWith('.html') && file !== 'index.html') {
    const filePath = path.join(distPath, file);
    let fileHtml = fs.readFileSync(filePath, 'utf8');
    
    if (!fileHtml.includes('pwa-install.js')) {
      fileHtml = fileHtml.replace('<head>', '<head>' + pwaTags);
      fileHtml = fileHtml.replace('</body>', pwaScripts + '</body>');
      fs.writeFileSync(filePath, fileHtml);
    }
  }
});

console.log('✅ All HTML files updated with PWA configuration!');

// Copier les fichiers PWA depuis public/ vers dist/
console.log('\n📦 Copying PWA files to dist...');

const pwaFiles = [
  'manifest.json',
  'service-worker.js',
  'pwa-install.js',
  'favicon.png',
  'icon-192.png',
  'icon-512.png'
];

pwaFiles.forEach(file => {
  const sourcePath = path.join(publicPath, file);
  const destPath = path.join(distPath, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  ✓ Copied ${file}`);
  } else {
    console.warn(`  ⚠ Warning: ${file} not found in public/`);
  }
});

console.log('\n✅ PWA setup complete! Your app is ready to be installed as PWA.');
