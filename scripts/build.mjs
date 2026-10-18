import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const outputDir = path.join(root, 'dist');
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(publicDir, outputDir, { recursive: true, force: true });
console.log(`Destino Frontera construido en ${outputDir}`);
