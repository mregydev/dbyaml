import * as ejs from "ejs";
import * as fs from "fs";
import * as prettier from "prettier";
import Config from "../Config";
import Messages from "../Messages";

/**
 * @param  {string} basePath
 * @param  {{Source:string;ConnectionStr:string;}} dboconfig
 */
function StartDbService(
  basePath: string,
  dboconfig: { Source: string; ConnectionStr: string }
) {
  return new Promise((resolve, reject) => {
    // Reject In case not database configuration
    if (!dboconfig) {
      reject(Messages.DbConfigNotFound);
    } else if (!dboconfig.Source || !dboconfig.ConnectionStr) {
      reject(Messages.DbConfigNotComplete);
    } else if (
      Config.SupportedDbs.indexOf(dboconfig.Source.toLowerCase()) === -1
    ) {
      reject(Messages.DbNotSuporrted);
    } else {
      // Getting  template to write in Context file
      const template = fs.readFileSync(
        `${__dirname}/Templates/${dboconfig.Source.toLowerCase()}/DbStart.ejs`
      );

      // bind connection string
      let parsedText = ejs.render(template.toString(), {
        connectionStr: dboconfig.ConnectionStr
      });

      parsedText = prettier.format(parsedText, { parser: "babel" });
      // Save to file
      fs.writeFileSync(`${basePath}/DAL/DbStart.js`, parsedText);

      resolve(true);
    }
  });
}

export { StartDbService };
