import { expect } from "chai";
import * as ejs from "ejs";
import * as fs from "fs";
import * as sinon from "sinon";
import { GenerateSchema } from "../../../src/GenerationPipeline/DbSchemaGenerator";
import * as prettier from "prettier";

describe("Generate schema context test cases", () => {
  describe("happy case test scenario", () => {
    let readStub, renderStub, writeStub, formatStub;

    beforeEach(() => {
      readStub = sinon.stub(fs, "readFileSync").returns("ww");
      renderStub = sinon
        .stub(ejs, "render")
        .withArgs("ww", { properties: "{Name: String}" })
        .returns("aaa");
      writeStub = sinon.stub(fs, "writeFileSync");
      formatStub = sinon.stub(prettier, "format");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should resolve to true in happy case", done => {
      GenerateSchema(".", "mongoddb", "Student", ["Name String"]).then(res => {
        expect(res).to.be.true;
        done();
      });
    });

    it("should read prettier format", done => {
      GenerateSchema(".", "mongodb", "Student", ["Name String"]).then(() => {
        sinon.assert.calledOnce(formatStub);
        done();
      });
    });

    it("should read database entity template", done => {
      GenerateSchema(".", "mongodb", "Student", ["Name String"]).then(() => {
        sinon.assert.calledOnce(readStub);
        done();
      });
    });

    it("should call ejs render ", done => {
      GenerateSchema(".", "mongodb", "Student", ["Name String"]).then(() => {
        sinon.assert.calledOnce(renderStub);
        done();
      });
    });

    it("should save entity template", done => {
      GenerateSchema(".", "mongodb", "Student", ["Name String"]).then(() => {
        sinon.assert.calledOnce(writeStub);
        done();
      });
    });
  });
});
