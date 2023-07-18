const { faker } = require("@faker-js/faker");

const chai = require("chai");
const sinon = require("sinon");
chai.use(require("sinon-chai"));
const request = require("supertest");

const { expect } = chai;

const { app } = require("../../startup");
const db = require("../../models");
const emailModule = require("../../helpers/email");

const returnUser = () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(["Admin", "Doctor"]),
    password: faker.internet.password(10, true, /[a-zA-Z0-9]+$/),
    isVerified: faker.datatype.boolean(),
    isActive: faker.datatype.boolean(),
  };

  return user;
};

const makeUser = async (data) => {
  const {
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    email = faker.internet.email(),
    role = faker.helpers.arrayElement(["Admin", "Doctor"]),
    password = faker.internet.password(10, true, /[a-zA-Z0-9]+$/),
    isVerified = faker.datatype.boolean(),
    isActive = faker.datatype.boolean(),
  } = data;

  return db.User.create({
    firstName,
    lastName,
    email,
    role,
    password,
    isVerified,
    isActive,
  });
};

describe("GET users", async () => {
  beforeEach(async () => {
    await db.User.destroy({ truncate: { cascade: true } });
  });

  it("Get all users", async () => {
    // act
    await makeUser({});
    await makeUser({});
    const response = await request(app).get("/api/users");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(2);
  });

  it("Get all users filtered by name", async () => {
    // act
    await makeUser({ firstName: "Calumn" });
    await makeUser({ firstName: "Rowan" });
    const response = await request(app).get("/api/users?search=Calumn");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(1);
  });

  it("Get all users filtered by name and role", async () => {
    // act
    await makeUser({ firstName: "Calumn", role: "Admin" });
    await makeUser({ firstName: "Rowan", role: "Doctor" });
    await makeUser({ firstName: "Louis", role: "Admin" });
    await makeUser({ firstName: "Joe", role: "Doctor" });
    const response = await request(app).get("/api/users?search=Calumn&role=Admin");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(1);
  });

  it("Get all users filtered role", async () => {
    // act
    await makeUser({ firstName: "Calumn", role: "Admin" });
    await makeUser({ firstName: "Rowan", role: "Doctor" });
    await makeUser({ firstName: "Louis", role: "Admin" });
    await makeUser({ firstName: "Joe", role: "Doctor" });
    const response = await request(app).get("/api/users?role=Admin");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(2);
  });
});

describe("POST users", async () => {
  const sandbox = sinon.createSandbox();
  let mockSendEmail = null;

  beforeEach(async () => {
    mockSendEmail = sandbox.stub(emailModule, "sendEmail").returns(true);
    // mockSendEmail = sandbox.spy(email, "sendEmailConsole");
    await db.User.destroy({ truncate: { cascade: true } });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Post one user", async () => {
    // arrange
    const user = returnUser();

    // act
    const response1 = await request(app).post("/api/users").send(user);
    const countUsers = await db.User.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(countUsers).to.equal(1);
    expect(mockSendEmail).to.have.been.called(1);
  });

  it("Post two users with the same email", async () => {
    // arrange
    const user = returnUser();

    // act
    const response1 = await request(app).post("/api/users").send(user);
    const response2 = await request(app).post("/api/users").send(user);
    const countUsers = await db.User.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(response2.status).to.equal(400);
    expect(countUsers).to.equal(1);
    expect(mockSendEmail).to.have.been.called(1);
  });
});
