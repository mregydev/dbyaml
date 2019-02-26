import Messages from "../../../src/Messages";
import { DbYamlCore } from "../../../src/Core";
import * as DbStartGenerator from "../../../src/GenerationPipeline/DbStartGenerator";
import * as fs from "fs";
import config from "../../testconfig";
import * as sinon from "sinon";
import { expect } from "chai";

describe("Core - BuildDbStartFunction function test cases", () => {
  let yamlCore = new DbYamlCore();

  let consolelog, startDbService;

  beforeEach(() => {
    consolelog = sinon.stub(console, "log");
    startDbService = sinon.stub(DbStartGenerator, "StartDbService");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should print DbConfigNotFound in case param DbConfig is null ", done => {
    yamlCore
      .BuildDbStartFunction(".", { Entities: null, DbConfig: null })
      .catch(msg => {
        expect(msg).to.equals(Messages.DbConfigNotFound);
        done();
      });
  });

  it("should call StartDbService in normal case", done => {
    yamlCore.BuildDbStartFunction(".", config).then(() => {
      sinon.assert.calledOnce(startDbService);
      done();
    });
  });
});
