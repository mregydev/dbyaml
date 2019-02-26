import * as ejs from "ejs";
import * as fs from "fs";
import Config from "../Config";
import Messages from "../Messages";
/**
 * @param  {string} basepath
 * @param  {string} source
 * @param  {string} entityname
 */
function GenerateEntityContext(
  basepath: string,
  source: string,
  entityname: string
) {
  return new Promise((resolve, reject) => {
    if (Config.SupportedDbs.indexOf(source) === -1) {
      reject(Messages.DbNotSuporrted);
    } else if (entityname) {
      try {
        // Getting  template to write in Context file
        const template = fs.readFileSync(
          `${__dirname}/Templates/${source}/context.ejs`
        );

        // bind entityname
        const parsedText = ejs.render(template.toString(), { entityname });

        // Save to file
        fs.writeFileSync(
          `${basepath}/DAL/${entityname}/${entityname}Context.js`,
          parsedText
        );

        resolve(true);
      } catch (ex) {
        console.log(ex);
      }
    } else {
      reject(Messages.EntityNameNotDefined);
    }
  });
}

export { GenerateEntityContext };
