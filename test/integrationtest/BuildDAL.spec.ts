import { execSync } from "child_process";
import { expect } from "chai";
import Messages from "../../src/Messages";
import testConfig from "../testconfig";
import * as fs from "fs";
import * as yaml from "yaml";
import testconfig from "../testconfig";
import { DbYamlConfig } from "../../src/Entities";

describe("Integration test : Generating DAL test cases", () => {
  before(() => {
    testconfig.DbConfig.installPackages = false;
  });

  it("should print ConfigNotExist message in case config file not found", done => {
    if (fs.existsSync("dbconfig.yml")) {
      fs.unlinkSync("dbconfig.yml");
    }

    let res = execSync(`node ./output`);

    expect(res.toString().trim()).to.contains(Messages.ConfigNotExist.trim());

    done();
  });

  it("should print DbConfigNotFound in case dbconfig not found in configuration", done => {
    fs.writeFileSync(`${__dirname}/dbconfig.yml`, "wrong configuration");

    let res = execSync(`node ./output ${__dirname}`);

    expect(res.toString().trim()).to.contains(Messages.DbConfigNotFound);

    done();
  });

  it("should print Entities not found in case entites not found", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    delete dbconfig.Entities;

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    let res = execSync(`node ./output ${__dirname}`);

    expect(res.toString().trim()).to.contains(Messages.EntitesNotFound);

    done();
  });

  it("should print DbNotSuporrted in case database source not supported by application", done => {
    let dbconfig: DbYamlConfig = {
      ...testconfig,
      DbConfig: {
        Source: "www",
        ConnectionStr: testConfig.DbConfig.ConnectionStr
      }
    };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    let res = execSync(`node ./output ${__dirname}`);

    expect(res.toString().trim()).to.contains(Messages.DbNotSuporrted);

    done();
  });

  it("should print DbConfigNotComplete in case database config source not provided", done => {
    let dbconfig: DbYamlConfig = {
      ...testconfig,
      DbConfig: {
        Source: null,
        ConnectionStr: testConfig.DbConfig.ConnectionStr
      }
    };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    let res = execSync(`node ./output ${__dirname}`);

    expect(res.toString().trim()).to.contains(
      Messages.DbConfigNotComplete.trim()
    );

    done();
  });

  it("should print DbConfigNotComplete in case database config ConnectionStr not provided", done => {
    let dbconfig: DbYamlConfig = {
      ...testconfig,
      DbConfig: { Source: testConfig.DbConfig.Source, ConnectionStr: null }
    };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    let res = execSync(`node ./output ${__dirname}`);

    expect(res.toString().trim()).to.contains(
      Messages.DbConfigNotComplete.trim()
    );

    done();
  });

  it("should generate dbstart.js file in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    expect(fs.existsSync(`${__dirname}/DAL/DbStart.js`)).to.be.true;

    done();
  });

  it("should write database start function inside dbstart.js in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    expect(
      fs
        .readFileSync(`${__dirname}/DAL/DbStart.js`)
        .toString()
        .replace(/\s+/g, "")
    ).to.contains(
      fs
        .readFileSync(`${__dirname}/expected/DbStart.js`)
        .toString()
        .replace(/\s+/g, "")
    );

    done();
  });

  it("should print NoEntityFields in case entity has no fields", done => {
    let dbconfig: DbYamlConfig = { ...testconfig, Entities: { Student: {} } };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    let res = execSync(`node ./output ${__dirname}`);

    expect(res.toString().trim()).to.contains(
      Messages.NoEntityFields("Student").trim()
    );

    done();
  });

  it("should create entities folder in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    let res = execSync(`node ./output ${__dirname}`);

    expect(fs.existsSync(`${__dirname}/DAL/Student`)).to.be.true;

    done();
  });

  it("should generate StudentContext.js file in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    expect(fs.existsSync(`${__dirname}/DAL/Student/StudentContext.js`)).to.be
      .true;

    done();
  });

  it("should write student context class inside StudentContext.js in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    expect(
      fs
        .readFileSync(`${__dirname}/DAL/Student/StudentContext.js`)
        .toString()
        .replace(/\s+/g, "")
    ).to.contains(
      fs
        .readFileSync(`${__dirname}/expected/StudentContext.js`)
        .toString()
        .replace(/\s+/g, "")
    );

    done();
  });

  it("should generate StudentEntity.js file in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    expect(fs.existsSync(`${__dirname}/DAL/Student/StudentEntity.js`)).to.be
      .true;

    done();
  });

  it("should write student entity class inside StudentEntity.js in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    expect(
      fs
        .readFileSync(`${__dirname}/DAL/Student/StudentEntity.js`)
        .toString()
        .replace(/\s+/g, "")
    ).to.contains(
      fs
        .readFileSync(`${__dirname}/expected/StudentEntity.js`)
        .toString()
        .replace(/\s+/g, "")
    );

    done();
  });

  it("should generate StudentSchema.js file in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    expect(fs.existsSync(`${__dirname}/DAL/Student/StudentSchema.js`)).to.be
      .true;

    done();
  });

  it("should write student sxhema class inside StudentSchema.js in normal case", done => {
    let dbconfig: DbYamlConfig = { ...testconfig };

    fs.writeFileSync(`${__dirname}/dbconfig.yml`, yaml.stringify(dbconfig));

    execSync(`node ./output ${__dirname}`);

    let generatedSchema = fs
      .readFileSync(`${__dirname}/DAL/Student/StudentSchema.js`)
      .toString()
      .replace(/\s+/g, "")
      .trim();
    let expectedSchema = fs
      .readFileSync(`${__dirname}/expected/StudentSchema.js`)
      .toString()
      .replace(/\s+/g, "")
      .trim();

    expect(generatedSchema).to.equals(expectedSchema);

    done();
  });
});
