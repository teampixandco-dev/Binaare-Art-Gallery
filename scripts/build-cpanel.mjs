import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "out");
const zipName = "binaare-art-gallery-cpanel.zip";
const zipPath = path.join(rootDir, zipName);

console.log("=== Building Binaare Art Gallery for cPanel ===");

// 1. Run next build
console.log("1. Running next build...");
execSync("npm run build", { stdio: "inherit" });

// 2. Ensure out directory exists
if (!fs.existsSync(outDir)) {
  console.error("Error: out directory was not created.");
  process.exit(1);
}

// 3. Ensure dual index files exist for directories to prevent 404/403 in Apache
console.log("2. Ensuring directory index files to prevent 404s...");
if (fs.existsSync(path.join(outDir, "shop.html"))) {
  fs.mkdirSync(path.join(outDir, "shop"), { recursive: true });
  fs.copyFileSync(path.join(outDir, "shop.html"), path.join(outDir, "shop", "index.html"));
  if (fs.existsSync(path.join(outDir, "shop.txt"))) {
    fs.copyFileSync(path.join(outDir, "shop.txt"), path.join(outDir, "shop", "index.txt"));
  }
  console.log("   ✓ Created shop/index.html");
}

if (fs.existsSync(path.join(outDir, "blog.html"))) {
  fs.mkdirSync(path.join(outDir, "blog"), { recursive: true });
  fs.copyFileSync(path.join(outDir, "blog.html"), path.join(outDir, "blog", "index.html"));
  if (fs.existsSync(path.join(outDir, "blog.txt"))) {
    fs.copyFileSync(path.join(outDir, "blog.txt"), path.join(outDir, "blog", "index.txt"));
  }
  console.log("   ✓ Created blog/index.html");
}

// 4. Ensure .htaccess is in out/
const publicHtaccess = path.join(rootDir, "public", ".htaccess");
const outHtaccess = path.join(outDir, ".htaccess");
if (fs.existsSync(publicHtaccess)) {
  fs.copyFileSync(publicHtaccess, outHtaccess);
  console.log("   ✓ Synced .htaccess to out/.htaccess");
}

// 5. Remove existing zip if any
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}
const optZipPath = path.join(rootDir, "binaare-cpanel-optimized.zip");
if (fs.existsSync(optZipPath)) {
  fs.unlinkSync(optZipPath);
}

// 6. Create zip archive from out/ contents
console.log("3. Packaging files into " + zipName + "...");
// Zip all files including hidden (.htaccess)
execSync(`cd "${outDir}" && zip -r "${zipPath}" . -x "*.DS_Store"`, { stdio: "inherit" });
fs.copyFileSync(zipPath, optZipPath);

const stats = fs.statSync(zipPath);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`\n=== Successfully created ${zipName} & binaare-cpanel-optimized.zip (${sizeMB} MB) ===`);
console.log("Ready to upload and extract in cPanel public_html!");

