import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

const srcPath = path.join(process.cwd(), "src");
const ignoreNodeModules = (filePath) => !filePath.includes("node_modules");

const runNodeProcess = (filePath) => {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["--no-warnings", "--loader=esm", filePath], {
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to run ${filePath}`));
      }
    });
  });
};

const walkDirectory = async (dir) => {
  const files = [];
  const walk = async (dirPath) => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory() && ignoreNodeModules(fullPath)) {
        await walk(fullPath);
      } else if (
        entry.isFile() &&
        fullPath.endsWith(".js") &&
        ignoreNodeModules(fullPath)
      ) {
        files.push(fullPath);
      }
    }
  };
  await walk(dir);
  return files;
};

(async () => {
  try {
    const jsFiles = await walkDirectory(srcPath);
    const promises = jsFiles.map(runNodeProcess);
    await Promise.all(promises);
    console.log("Build successful");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
})();
