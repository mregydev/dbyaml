import * as ejs from "ejs";
import * as fs from "fs";
import Messages from "../Messages";
/**
 * @param  {string} source
 * @param  {string} entityname
 * @param  {string[]} entityFields
 * @param  {string} basepath
 */
function GenerateSchema(
  basepath: string,
  source: string,
  entityname: string,
  entityFields: string[]
) {
  return new Promise((resolve, reject) => {
    let properties = `{`;

    // Extracing fields as object
    properties += entityFields.map(field => {
      const fieldDetails = field.split(/\s+/);

      if (fieldDetails.length >= 2) {
        const fieldName = fieldDetails[0];
        const fieldType = fieldDetails[1];

        if (fieldType === "ref") {
          return `${fieldName}:{type:types.ObjectId,ref:'${fieldDetails[2]}'}`;
        } else {
          return `${fieldName}: ${fieldType}`;
        }
      } else {
        reject(Messages.FieldPropertiesProblem(entityname));
      }
    });

    properties += `}`;

    // Getting schema template
    const template = fs.readFileSync(
      `${__dirname}/Templates/${source.toLowerCase()}/schema.ejs`
    );

    // bind schema properties
    const parsedText = ejs.render(template.toString(), { properties });

    fs.writeFileSync(
      `${basepath}/DAL/${entityname}/${entityname}Schema.js`,
      parsedText
    );

    resolve(true);
  });
}

export { GenerateSchema };
