// Corrige le package.json généré par Figma Make pour le rendre compatible npm.
// 1. Supprime les doublons de dépendances au format "pkg@version": "npm:pkg@version"
//    (syntaxe pnpm, refusée par npm : EINVALIDPACKAGENAME).
// 2. Déplace react / react-dom depuis peerDependencies (optionnelles, donc jamais
//    installées) vers dependencies, sans quoi le build échoue.
import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

const deps = {};
for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
  if (typeof version === 'string' && version.startsWith('npm:')) continue;
  deps[name] = version;
}

const peers = pkg.peerDependencies ?? {};
deps.react = peers.react ?? '18.3.1';
deps['react-dom'] = peers['react-dom'] ?? '18.3.1';

pkg.dependencies = Object.fromEntries(Object.entries(deps).sort());
delete pkg.peerDependencies;
delete pkg.peerDependenciesMeta;
delete pkg.pnpm;

writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log(`package.json corrigé — ${Object.keys(pkg.dependencies).length} dépendances.`);
