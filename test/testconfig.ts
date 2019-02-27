export default {
  DbConfig: {
    ConnectionStr: "mongodb://localhost:27017/test",
    Source: "mongodb",
    installPackages: true
  },

  Entities: {
    Student: {
      Fields: ["Name String"]
    }
  }
};
