import Messages from "../../../src/Messages";
import { DbYamlCore } from "../../../src/Core";
import * as PackageInstaller from "../../../src/GenerationPipeline/PackageInstaller";
import { expect } from "chai";
import config from "../../testconfig";
import * as sinon from "sinon";

describe("Core - BuildRequiredPackages function test cases", () => {
  let yamlCore = new DbYamlCore();

  let consolelog, installPackages;

  beforeEach(() => {
    consolelog = sinon.stub(console, "log");
    installPackages = sinon.stub(PackageInstaller, "InstallPackages");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should print DbConfigNotFound in case param DbConfig is null ", done => {
    yamlCore
      .BuildRequiredPackages({ Entities: null, DbConfig: null })
      .catch(msg => {
        expect(msg).to.equals(Messages.DbConfigNotFound);
        done();
      });
  });

  it("should print DbConfigNotComplete in case param DbConfig Source is null ", done => {
    yamlCore
      .BuildRequiredPackages({
        Entities: null,
        DbConfig: { Source: null, ConnectionStr: null }
      })
      .catch(msg => {
        expect(msg).to.equals(Messages.DbConfigNotComplete);
        done();
      });
  });

  it("should call InstallPackages ", done => {
    yamlCore.BuildRequiredPackages(config).then(() => {
      sinon.assert.calledOnce(installPackages);
      done();
    });
  });
});
