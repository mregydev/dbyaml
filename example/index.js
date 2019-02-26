const StartDb = require("./DAL/DbStart");
const Person = require("./DAL/Person/PersonEntity");
const PersonContext = require("./DAL/Person/PersonContext");


//Connect to database server
StartDb();


ApplyExample();

async function ApplyExample() {
  let instance = new Person();
  instance.Age = 12;
  instance.Name = "alaa";

  const context = new PersonContext();

  //Inserting
  let entity = await context.Insert(instance);

  //Selecting
  let data = await context.Select({});

  console.log(`Data after insert ${data}`);

  entity.Name = "hamed";
  entity.SchoolId = "5c6821154cbc9d5c14f84732";

  //Updating
  await context.Update(entity);

  //Data After Update
  data = await context.Select({});

  console.log(`Data after update ${data}`);

  await context.RemoveAll();

  data = await context.Select({});

  console.log(`Data after remove ${data}`);
}
