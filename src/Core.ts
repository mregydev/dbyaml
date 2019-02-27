import * as fs from "fs";
import * as yaml from "yaml";
import Config from "./Config";
import { DbYamlConfig } from "./Entities";
import { GenerateEntityContext } from "./GenerationPipeline/DbContextGenerator";
import { GenerateEntity } from "./GenerationPipeline/DbEntityGenerator";
import { GenerateSchema } from "./GenerationPipeline/DbSchemaGenerator";
import { StartDbService } from "./GenerationPipeline/DbStartGenerator";
import { InstallPackages } from "./GenerationPipeline/PackageInstaller";
import Messages from "./Messages";

class DbYamlCore {
  /**
   * Main function for building Data access folder
   */
  public async BuildDAL() {
    const basePath =
      process.argv[2] && process.argv[2][0] !== "-" ? process.argv[2] : ".";

    try {
      let ext = "";

      // Reject in case not config file exist
      if (!fs.existsSync(`${basePath}/dbconfig.yml`)) {
        if (!fs.existsSync(`${basePath}/dbconfig.yaml`)) {
          throw Messages.ConfigNotExist;
        } else {
          ext = "yaml";
        }
      } else {
        ext = "yml";
      }

      // Read confiugration
      const content = fs.readFileSync(`${basePath}/dbconfig.${ext}`).toString();

      // Get config object after parsing yaml file
      const configObject = yaml.parse(content);

      // create DAL folder
      this.CreateFolder(`${basePath}/DAL`);

      //  Build Required Packages
      if (configObject.DbConfig && configObject.DbConfig.installPackages) {
        await this.BuildRequiredPackages(configObject);
      }

      //  Database Start function
      await this.BuildDbStartFunction(basePath, configObject);

      //  build entities
      await this.BuildEntities(basePath, configObject);

      console.log(Messages.Finish);
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * @param  {DbYamlConfig} configObject
   */
  public async BuildRequiredPackages(configObject: DbYamlConfig) {
    if (!configObject.DbConfig) {
      throw Messages.DbConfigNotFound;
    } else if (!configObject.DbConfig.Source) {
      throw Messages.DbConfigNotComplete;
    } else if (
      Config.SupportedDbs.indexOf(configObject.DbConfig.Source) === -1
    ) {
      throw Messages.DbNotSuporrted;
    } else {
      // Install required packages for current db type
      await InstallPackages(configObject.DbConfig.Source);
    }
  }

  /**
   * @param  {string} basePath
   * @param  {DbYamlConfig} configObject
   */
  public async BuildDbStartFunction(
    basePath: string = ".",
    configObject: DbYamlConfig
  ) {
    // Database Start function
    if (!configObject.DbConfig) {
      throw Messages.DbConfigNotFound;
    } else {
      await StartDbService(basePath, configObject.DbConfig);
    }
  }

  /**
   * @param  {string} basePath
   * @param  {DbYamlConfig} basconfigObject
   */
  public async BuildEntities(
    basePath: string = ".",
    configObject: DbYamlConfig
  ) {
    if (!configObject.Entities) {
      throw Messages.EntitesNotFound;
    } else {
      for (const entityname of Object.keys(configObject.Entities)) {
        // Generating folder for this entity
        this.CreateFolder(`${basePath}/DAL/${entityname}`);

        // Generate entity schema
        if (!configObject.Entities[entityname].Fields) {
          throw Messages.NoEntityFields(entityname);
        } else {
          // Generate schema class
          await GenerateSchema(
            basePath,
            configObject.DbConfig.Source,
            entityname,
            configObject.Entities[entityname].Fields
          );

          await GenerateEntity(
            basePath,
            configObject.DbConfig.Source,
            entityname,
            configObject.Entities[entityname].Fields
          );

          // Generate context class
          await GenerateEntityContext(
            basePath,
            configObject.DbConfig.Source,
            entityname
          );
        }
      }
    }
  }
  /**
   * @param  {} path
   */
  private CreateFolder(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }
}

export { DbYamlCore };
