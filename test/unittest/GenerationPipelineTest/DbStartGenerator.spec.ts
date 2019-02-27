import { expect } from "chai";
import * as ejs from "ejs";
import * as fs from "fs";
import * as sinon from "sinon";
import { StartDbService } from "../../../src/GenerationPipeline/DbStartGenerator";
import Messages from "../../../src/Messages";
import * as prettier from "prettier";

describe("Generate entity context test cases", () => {
  describe("passing wrong parameters", () => {
    it("should reject in case based config is null", done => {
      StartDbService(".", null).catch(msg => {
        expect(msg).to.equal(Messages.DbConfigNotFound);
        done();
      });
    });

    it("should reject in case connection string not provided in passed config", done => {
      StartDbService(".", { Source: "mongodb", ConnectionStr: "" }).catch(
        msg => {
          expect(msg).to.equal(Messages.DbConfigNotComplete);
          done();
        }
      );
    });

    it("should reject in case db source not provided in passed config", done => {
      StartDbService(".", {
        ConnectionStr: "mongodb://12:10/testdb",
        Source: ""
      }).catch(msg => {
        expect(msg).to.equal(Messages.DbConfigNotComplete);
        done();
      });
    });

    describe("happy case test scenario", () => {
      let readSpy, renderSpy, writeSpy, formatStub;

      beforeEach(() => {
        readSpy = sinon.stub(fs, "readFileSync").returns("ww");
        renderSpy = sinon
          .stub(ejs, "render")
          .withArgs("ww", { connectionStr: "mongodb://12:10/testdb" })
          .returns("aaa");
        writeSpy = sinon.stub(fs, "writeFileSync");
        formatStub = sinon.stub(prettier, "format");
      });

      afterEach(() => {
        sinon.restore();
      });

      it("should read prettier format", done => {
        StartDbService(".", {
          Source: "mongodb",
          ConnectionStr: "mongodb://12:10/testdb"
        }).then(res => {
          expect(res).to.be.true;
          done();
        });
      });

      it("should resolve to true in happy case", done => {
        StartDbService(".", {
          Source: "mongodb",
          ConnectionStr: "mongodb://12:10/testdb"
        }).then(res => {
          expect(res).to.be.true;
          done();
        });
      });

      it("should reject in case db source not supported", done => {
        StartDbService(".", {
          Source: "mongodb",
          ConnectionStr: "mongodb://12:10/testdb"
        }).then(() => {
          sinon.assert.calledOnce(formatStub);
          done();
        });
      });

      it("should read database start template", done => {
        StartDbService(".", {
          Source: "mongodb",
          ConnectionStr: "mongodb://12:10/testdb"
        }).then(() => {
          sinon.assert.calledOnce(readSpy);
          done();
        });
      });

      it("should parse database start template", done => {
        StartDbService(".", {
          Source: "mongodb",
          ConnectionStr: "mongodb://12:10/testdb"
        }).then(() => {
          sinon.assert.calledOnce(renderSpy);
          done();
        });
      });

      it("should save database start template", done => {
        StartDbService(".", {
          Source: "mongodb",
          ConnectionStr: "mongodb://12:10/testdb"
        }).then(() => {
          sinon.assert.calledOnce(writeSpy);
          done();
        });
      });
    });
  });
});
