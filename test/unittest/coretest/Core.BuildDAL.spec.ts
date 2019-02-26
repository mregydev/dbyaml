import Messages from "../../../src/Messages";
import { DbYamlCore } from "../../../src/Core";
import * as fs from "fs";
import * as yaml from "yaml";
import config from "../../testconfig";
import * as sinon from "sinon";

describe("Core - BuildDAL function test cases", () => {
  let yamlCore = new DbYamlCore();

  let consolelog,
    buildRequiredPackages,
    fsmock,
    buildDbStartFunction,
    beautifyCode,
    buildEntities,
    yamlparse;

  beforeEach(() => {
    fsmock = sinon.mock(fs);

    consolelog = sinon.stub(console, "log");
    buildRequiredPackages = sinon.stub(yamlCore, "BuildRequiredPackages");
    buildDbStartFunction = sinon.stub(yamlCore, "BuildDbStartFunction");
    buildEntities = sinon.stub(yamlCore, "BuildEntities");
    beautifyCode = sinon.stub(yamlCore, "BeautifyCode");
    yamlparse = sinon.stub(yaml, "parse").returns(config);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should print ConfigNotExist in case config files not exist", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(false);
    yamlCore.BuildDAL().then(() => {
      fsmock.verify();
      sinon.assert.calledOnce(consolelog.withArgs(Messages.ConfigNotExist));
      done();
    });
  });

  it("should read config file dbconfig.yml", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock.expects("readFileSync").withArgs("./dbconfig.yml");

    yamlCore.BuildDAL().then(() => {
      fsmock.verify();
      done();
    });
  });

  it("shoud parse yaml content read from config file", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock
      .expects("readFileSync")
      .withArgs("./dbconfig.yml")
      .returns("content");
    fsmock
      .expects("existsSync")
      .withArgs("./DAL")
      .returns(true);

    yamlCore.BuildDAL().then(() => {
      sinon.assert.calledOnce(yamlparse);
      done();
    });
  });

  it("shoud call BuildRequiredPackages function in normal case", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock
      .expects("readFileSync")
      .withArgs("./dbconfig.yml")
      .returns("content");
    fsmock
      .expects("existsSync")
      .withArgs("./DAL")
      .returns(true);

    yamlCore.BuildDAL().then(() => {
      sinon.assert.calledOnce(buildRequiredPackages.withArgs(config));
      done();
    });
  });

  it("shoud call BuildDbStartFunction function in normal case", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock
      .expects("readFileSync")
      .withArgs("./dbconfig.yml")
      .returns("content");
    fsmock
      .expects("existsSync")
      .withArgs("./DAL")
      .returns(true);

    yamlCore.BuildDAL().then(() => {
      sinon.assert.calledOnce(buildDbStartFunction.withArgs(".", config));
      done();
    });
  });

  it("shoud call BuildEntities function in normal case", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock
      .expects("readFileSync")
      .withArgs("./dbconfig.yml")
      .returns("content");
    fsmock
      .expects("existsSync")
      .withArgs("./DAL")
      .returns(true);

    yamlCore.BuildDAL().then(() => {
      sinon.assert.calledOnce(buildEntities);
      done();
    });
  });

  it("shoud call BeautifyCode function in normal case", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock
      .expects("readFileSync")
      .withArgs("./dbconfig.yml")
      .returns("content");
    fsmock
      .expects("existsSync")
      .withArgs("./DAL")
      .returns(true);

    yamlCore.BuildDAL().then(() => {
      sinon.assert.calledOnce(beautifyCode.withArgs("."));
      done();
    });
  });

  it("shoud print Finish messages at the end", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock
      .expects("readFileSync")
      .withArgs("./dbconfig.yml")
      .returns("content");
    fsmock
      .expects("existsSync")
      .withArgs("./DAL")
      .returns(true);

    yamlCore.BuildDAL().then(() => {
      sinon.assert.calledOnce(consolelog.withArgs(Messages.Finish));
      done();
    });
  });

  it("should print exception message in case exception thrown", done => {
    fsmock
      .expects("existsSync")
      .withArgs("./dbconfig.yml")
      .returns(true);
    fsmock.expects("readFileSync").callsFake(() => {
      throw "FileNotExist";
    });
    fsmock
      .expects("existsSync")
      .withArgs("./DAL")
      .returns(true);

    yamlCore.BuildDAL().then(() => {
      sinon.assert.calledOnce(consolelog.withArgs("FileNotExist"));
      done();
    });
  });
});
