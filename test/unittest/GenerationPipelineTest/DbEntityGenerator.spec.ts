import { expect } from "chai";
import * as ejs from "ejs";
import * as fs from "fs";
import * as sinon from "sinon";
import { GenerateEntity } from "../../../src/GenerationPipeline/DbEntityGenerator";

describe("Generate entity context test cases", () => {
  describe("happy case test scenario", () => {
    let readSpy, renderSpy, writeSpy;

    beforeEach(() => {
      readSpy = sinon.stub(fs, "readFileSync").returns("ww");
      renderSpy = sinon
        .stub(ejs, "render")
        .withArgs("ww", {
          properties: "this.Name=undefined\n",
          entityname: "Student"
        })
        .returns("aaa");
      writeSpy = sinon.stub(fs, "writeFileSync");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should resolve to true in happy case", done => {
      GenerateEntity(".", "mongoddb", "Student", ["Name String"]).then(res => {
        expect(res).to.be.true;
        done();
      });
    });

    it("should read database entity template", done => {
      GenerateEntity(".", "mongodb", "Student", ["Name String"]).then(() => {
        sinon.assert.calledOnce(readSpy);
        done();
      });
    });

    it("should call ejs render ", done => {
      GenerateEntity(".", "mongodb", "Student", ["Name String"]).then(() => {
        sinon.assert.calledOnce(renderSpy);
        done();
      });
    });

    it("should save entity template", done => {
      GenerateEntity(".", "mongodb", "Student", ["Name String"]).then(() => {
        sinon.assert.calledOnce(writeSpy);
        done();
      });
    });
  });
});
