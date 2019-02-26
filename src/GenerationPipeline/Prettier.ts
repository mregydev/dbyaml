import * as execa from "execa";

/**
 * Beautfiy DAL files using prettier
 * @param  {string} basepath
 */
function BeautifyDALFiles(basepath: string) {
  return new Promise((resolve, reject) => {
    execa.sync("node_modules/.bin/prettier", ["--write", `${basepath}/DAL/**`]);
    resolve(true);
  });
}

export { BeautifyDALFiles };
