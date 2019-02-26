import { expect } from "chai";
import * as execa from "execa";
import * as sinon from "sinon";
import { BeautifyDALFiles } from "../../../src/GenerationPipeline/Prettier";

describe("Generate entity context test cases", () => {
  describe("happy case test scenario", () => {
    let syncStub;
    before(() => {
      syncStub = sinon.stub(execa, "sync");
    });

    it("should call execSync one time", done => {
      BeautifyDALFiles(".").then(() => {
        sinon.assert.calledOnce(
          syncStub.withArgs("node_modules/.bin/prettier", [
            "--write",
            `./DAL/**`
          ])
        );
        done();
      });
    });

    it("should resolve to true", done => {
      BeautifyDALFiles(".").then(res => {
        expect(res).to.be.true;
        done();
      });
    });
  });
});
