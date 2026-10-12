import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'types') {
        continue;
      }
      walk(full, files);
    } else if (/\.tsx?$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function preprocess(code, filePath) {
  let next = code;
  next = next.replace(/^import\s+type\s+[^\n]+\n/gm, '');
  next = next.replace(/^import\s+\{[^}]*\}\s+from\s+['"]@\/types\/[^'"]+['"];?\s*\n/gm, '');
  next = next.replace(
    /import\s+\{([^}]+)\}\s+from\s+(['"][^'"]+['"])/g,
    (match, imports, from) => {
      const parts = imports
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part && !part.startsWith('type '));
      if (parts.length === 0) {
        return '';
      }
      return `import { ${parts.join(', ')} } from ${from}`;
    },
  );
  next = next.replace(/^type\s+\w+\s+=\s+[^\n]+;\s*\n/gm, '');
  next = next.replace(/^interface\s+\w+[^{]*\{[\s\S]*?\n\}\s*\n/gm, '');
  if (filePath.endsWith('constants.ts')) {
    next = next.replace(/^import[^\n]+\n/gm, '');
    next = next.replace(/export type Permission[\s\S]*?;\s*\n/gm, '');
    next = next.replace(/:\s*TicketStatus\[\]/g, '');
    next = next.replace(/:\s*TicketPriority\[\]/g, '');
    next = next.replace(/:\s*Role\[\]/g, '');
    next = next.replace(/:\s*Record<[^>]+>/g, '');
  }
  return next;
}

function hasJsx(code) {
  return /<[A-Za-z]/.test(code);
}

const files = walk(srcDir);
const written = [];

for (const filePath of files) {
  if (filePath.includes(`${path.sep}types${path.sep}`)) {
    continue;
  }
  const rel = path.relative(srcDir, filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const pre = preprocess(raw, filePath);
  const loader = filePath.endsWith('.tsx') ? 'tsx' : 'ts';
  const result = transformSync(pre, {
    loader,
    format: 'esm',
    jsx: 'automatic',
    target: 'es2022',
  });
  const jsx = hasJsx(result.code);
  const outRel = rel.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');
  const outPath = path.join(srcDir, outRel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, result.code);
  written.push(outPath);
  fs.unlinkSync(filePath);
}

const typesDir = path.join(srcDir, 'types');
if (fs.existsSync(typesDir)) {
  fs.rmSync(typesDir, { recursive: true, force: true });
}

const viteEnv = path.join(srcDir, 'vite-env.d.ts');
if (fs.existsSync(viteEnv)) {
  fs.unlinkSync(viteEnv);
}

console.log(`Converted ${written.length} files`);
