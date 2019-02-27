import "mocha";
import { expect } from "chai";
import * as ejs from "ejs";
import * as fs from "fs";
import * as sinon from "sinon";
import * as prettier from "prettier";
import { GenerateEntityContext } from "../../../src/GenerationPipeline/DbContextGenerator";
import Messages from "../../../src/Messages";

describe("Generate entity context test cases", () => {
  describe("passing wrong parameters", () => {
    it("should reject with db not supported in case source not exist", done => {
      GenerateEntityContext(".", "tt", "Student").catch(msg => {
        expect(msg).to.equal(Messages.DbNotSuporrted);
        done();
      });
    });

    it("should reject with entity name not provided", done => {
      GenerateEntityContext(".", "mongodb", "").catch(msg => {
        expect(msg).to.equal(Messages.EntityNameNotDefined);
        done();
      });
    });
  });

  describe("happy case test scenario", () => {
    let readStub, renderStub, writeStub, formatStub;

    beforeEach(() => {
      readStub = sinon.stub(fs, "readFileSync").returns("ww");
      renderStub = sinon
        .stub(ejs, "render")
        .withArgs("ww", { entityname: "Student" })
        .returns("aaa");
      writeStub = sinon.stub(fs, "writeFileSync");
      formatStub = sinon.stub(prettier, "format");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should resolve to true in happy case", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(res => {
        expect(res).to.be.true;
        done();
      });
    });

    it("should read prettier format", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(() => {
        sinon.assert.calledOnce(formatStub);
        done();
      });
    });

    it("should read database context template", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(() => {
        sinon.assert.calledOnce(readStub);
        done();
      });
    });

    it("should parse database context template", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(() => {
        sinon.assert.calledOnce(renderStub);
        done();
      });
    });

    it("should save database context template", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(() => {
        sinon.assert.calledOnce(writeStub);
        done();
      });
    });
  });
});
