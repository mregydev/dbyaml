# Introduction

dbyaml is a command line tool to build data access layer based on config yaml file and its name should be dbconfig.yaml.

# dbyaml file example

```yaml
DbConfig:
  Source: mongodb
  ConnectionStr: mongodb://localhost:27017/test

Entities:
  Person:
    Fields:
      - Name String
      - Age Number
      - SchoolId ref School
```

## **Dbconfig** contains information for the database provider including :

## Source 
Database type you are using which is currently only mongodb that is supported in the future other types will be supported
## ConnectionStr 
Connection string for database

## intallPackages
If true then related packages to datasource will be installed otherwise it will not be installed

## Entities
Entities contains information for the data access entities and each entity contains property called **Fields** which contains list of string representing properties of this entity with each one contains property name and property type which now can be either **String,Number,Boolean, ref**

After building your dbconfig.yaml file run following command 

```node.js
dbyaml 'path-to-dbyaml'
```

In case you havenot entered path to dbyaml , it will be cosidered current working directory

After you run following files will be generated : 

## DbStart.js : 
It will contain start function which connects to database server

Also it will create folder called Entities and then for each entity it will create three files (assuming entity name is student):

## StudentSchema.js :
Returns object with it properties feild names and values field types
## StudentEntity.js :
Return class that its properties is based on object returned from StudentSchema
## StudentContext.js :
Return class used for applying crud operations on Student entity


example folder shows how to use them
