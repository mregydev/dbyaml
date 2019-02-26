import { DbYamlCore } from "../../../src/Core";
import * as BeautifyDALFiles from "../../../src/GenerationPipeline/Prettier";
import * as sinon from "sinon";

describe("Core - BeautifyCode function test cases", () => {
  let yamlCore = new DbYamlCore();

  let beautifyDALFiles;

  beforeEach(() => {
    beautifyDALFiles = sinon.stub(BeautifyDALFiles, "BeautifyDALFiles");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call BeautifyDALFiles ", done => {
    yamlCore.BeautifyCode().then(() => {
      sinon.assert.calledOnce(beautifyDALFiles);
      done();
    });
  });
});
