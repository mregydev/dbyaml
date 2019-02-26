import * as ejs from "ejs";
import * as fs from "fs";
import Messages from "../Messages";

/**
 * @param  {string} basepath
 * @param  {string} source
 * @param  {string} entityname
 * @param  {string[]} entityFields
 */
function GenerateEntity(
  basepath: string,
  source: string,
  entityname: string,
  entityFields: string[]
) {
  return new Promise((resolve, reject) => {
    let properties = "";

    // Extracing fields as object
    entityFields.forEach(field => {
      const fieldDetails = field.split(/\s+/);

      if (fieldDetails.length >= 2) {
        const fieldName = fieldDetails[0];

        if (fieldName) {
          properties += `this.${fieldName}=undefined\n`;
        } else {
          reject(Messages.FieldNameNotCorrent);
        }
      } else {
        reject(Messages.FieldPropertiesProblem(entityname));
      }
    });

    // Getting schema template
    const template = fs.readFileSync(
      `${__dirname}/Templates/${source.toLowerCase()}/entity.ejs`
    );

    // bind schema properties
    const parsedText = ejs.render(template.toString(), {
      properties,
      entityname
    });

    fs.writeFileSync(
      `${basepath}/DAL/${entityname}/${entityname}Entity.js`,
      parsedText
    );

    resolve(true);
  });
}

export { GenerateEntity };
