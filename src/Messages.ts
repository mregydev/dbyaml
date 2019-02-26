export default {
  DbConfigNotFound:
    "Database config not found in configuration please check how to add it from documentation",
  DbConfigNotComplete:
    "Database config should contains both source and connection string",
  DbNotSuporrted: "Current dataabase isnot supported",
  FieldPropertiesProblem: (entityname: string) =>
    `${entityname} properties are incorrect please check them`,
  FieldTypeNotCorrect: (
    entityname: string,
    propertyname: string,
    propertytype: string
  ) =>
    `${entityname} property ${propertyname} has unsupported type ${propertytype}`,
  EntitesNotFound: "Entities not found in config file",
  NoEntityFields: (entityname: string) => `${entityname} has no fields`,
  EntityNameNotDefined: `Entity name is not defined`,
  ConfigNotExist: "Config file not exist ,make sure dbconfig.yaml exist",
  InvalidType: (propName: string) => `${propName} has invalid type`,
  Finish: "Congratulation package is generated please check DAL folder",
  FieldNameNotCorrent: `Field name is incorrect or missing`
};
