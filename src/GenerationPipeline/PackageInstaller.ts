import { execSync } from "child_process";

function InstallPackages(dbSource: string) {
  let baseInstaller;

  if (dbSource.toLowerCase() === "mongodb") {
    baseInstaller = new MongoosePackageInstaller();
    return baseInstaller.InstallPackages();
  }
}

class MongoosePackageInstaller {
  /**
   * Install mongoose and prettier packages
   */
  public InstallPackages() {
    return new Promise(resolve => {
      execSync("npm i mongoose --save");
      resolve(true);
    });
  }
}

export { InstallPackages };
