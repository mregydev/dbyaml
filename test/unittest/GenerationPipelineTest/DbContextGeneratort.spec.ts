import "mocha";
import { expect } from "chai";
import * as ejs from "ejs";
import * as fs from "fs";
import * as sinon from "sinon";
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
    let readSpy, renderSpy, writeSpy;

    beforeEach(() => {
      readSpy = sinon.stub(fs, "readFileSync").returns("ww");
      renderSpy = sinon
        .stub(ejs, "render")
        .withArgs("ww", { entityname: "Student" })
        .returns("aaa");
      writeSpy = sinon.stub(fs, "writeFileSync");
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

    it("should read database context template", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(() => {
        sinon.assert.calledOnce(readSpy);
        done();
      });
    });

    it("should parse database context template", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(() => {
        sinon.assert.calledOnce(renderSpy);
        done();
      });
    });

    it("should save database context template", done => {
      GenerateEntityContext(".", "mongodb", "Student").then(() => {
        sinon.assert.calledOnce(writeSpy);
        done();
      });
    });
  });
});
