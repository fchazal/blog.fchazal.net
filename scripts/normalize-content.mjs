import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "content", "posts");
const codeDir = path.join(root, "content", "code");

const IMG = /\.(jpe?g|png|webp|gif|avif)$/i;

/* Posts : une image unique remonte à la racine, sous le nom du post */
for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const base = entry.name;
  const dir = path.join(postsDir, base);
  const mdExists = fs.existsSync(path.join(postsDir, `${base}.md`));
  if (!mdExists) continue;

  const images = fs.readdirSync(dir).filter((f) => IMG.test(f));

  if (images.length === 0) {
    fs.rmdirSync(dir);
    console.log(`- dossier vide supprimé : ${base}/`);
  } else if (images.length === 1) {
    const ext = path.extname(images[0]);
    fs.renameSync(path.join(dir, images[0]), path.join(postsDir, `${base}${ext}`));
    fs.rmdirSync(dir);
    console.log(`- image unique : ${base}/${images[0]} -> ${base}${ext}`);
  } else {
    console.log(`- galerie conservée : ${base}/ (${images.length} images)`);
  }
}

/* Code : aplatir (base.md + base.js à la racine de content/code) */
for (const entry of fs.readdirSync(codeDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const base = entry.name;
  const dir = path.join(codeDir, base);
  const files = fs.readdirSync(dir);

  const md = files.find((f) => f.endsWith(".md"));
  const js = files.find((f) => f.endsWith(".js"));

  if (md) fs.renameSync(path.join(dir, md), path.join(codeDir, `${base}.md`));
  if (js) fs.renameSync(path.join(dir, js), path.join(codeDir, `${base}.js`));

  const remaining = fs.readdirSync(dir);
  if (remaining.length === 0) {
    fs.rmdirSync(dir);
  } else {
    console.log(`! fichiers restants dans ${base}/ : ${remaining.join(", ")}`);
  }
  console.log(`- code aplati : ${base}`);
}

console.log("\nTerminé.");
