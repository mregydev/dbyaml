import { expect } from "chai";
import Messages from "../../../src/Messages";
import { DbYamlCore } from "../../../src/Core";
import * as SchemaGenrator from "../../../src/GenerationPipeline/DbSchemaGenerator";
import * as EntityGenerator from "../../../src/GenerationPipeline/DbEntityGenerator";
import * as ContextGenerator from "../../../src/GenerationPipeline/DbContextGenerator";
import * as fs from "fs";
import config from "../../testconfig";

import * as sinon from "sinon";

describe("Core - BuildEntities function test cases", () => {
  let yamlCore = new DbYamlCore();

  let consolelog, generateSchema, generateEntity, generateEntityContext, fsmock;

  beforeEach(() => {
    fsmock = sinon.mock(fs);
    consolelog = sinon.stub(console, "log");
    generateSchema = sinon.stub(SchemaGenrator, "GenerateSchema");
    generateEntity = sinon.stub(EntityGenerator, "GenerateEntity");
    generateEntityContext = sinon.stub(
      ContextGenerator,
      "GenerateEntityContext"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should print EntitesNotFound in case entities not provided config", done => {
    yamlCore
      .BuildEntities(".", { Entities: null, DbConfig: null })
      .catch(msg => {
        expect(msg).to.equals(Messages.EntitesNotFound);
        done();
      });
  });

  it("should print NoEntityFields in case no entity fields provided for entity", done => {
    fsmock.expects("mkdirSync").calledOnce;

    yamlCore
      .BuildEntities(".", {
        ...config,
        Entities: { Student: { Fields: null } }
      })
      .catch(msg => {
        expect(msg).to.equals(Messages.NoEntityFields("Student"));
        done();
      });
  });

  it("should should create directory for entity in case passed config in correct", done => {
    fsmock.expects("existsSync").returns(false).calledOnce;
    fsmock.expects("mkdirSync").calledOnce;

    yamlCore.BuildEntities(".", config).then(() => {
      fsmock.verify();
      done();
    });
  });

  it("should call GenerateSchema function", done => {
    fsmock.expects("mkdirSync").withArgs("./DAL/Student").calledOnce;
    yamlCore.BuildEntities(".", config).then(() => {
      sinon.assert.calledOnce(generateSchema);
      done();
    });
  });

  it("should call GenerateEntity function", done => {
    fsmock.expects("mkdirSync").withArgs("./DAL/Student").calledOnce;
    yamlCore.BuildEntities(".", config).then(() => {
      sinon.assert.calledOnce(generateEntity);
      done();
    });
  });

  it("should call GenerateContext function", done => {
    fsmock.expects("mkdirSync").withArgs("./DAL/Student").calledOnce;
    yamlCore.BuildEntities(".", config).then(() => {
      sinon.assert.calledOnce(generateEntityContext);
      done();
    });
  });
});
