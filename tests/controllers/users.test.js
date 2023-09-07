const { faker } = require("@faker-js/faker");

const chai = require("chai");
const request = require("supertest");
const bcrypt = require("bcrypt");

const { expect } = chai;

const { app } = require("../../startup");
const db = require("../../models");

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

  const salt = await bcrypt.genSaltSync(10, "a");

  return db.User.create({
    firstName,
    lastName,
    email,
    role,
    password: bcrypt.hashSync(password, salt),
    isVerified,
    isActive,
  });
};

describe("GET users", async () => {
  let token;

  beforeEach(async () => {
    await db.User.destroy({ truncate: { cascade: true } });
    const salt = await bcrypt.genSaltSync(10, "a");
    await db.User.create({
      firstName: "Joe",
      lastName: "Doe",
      email: "joedoe@gmail.com",
      role: "Admin",
      password: bcrypt.hashSync("testtest", salt),
      isVerified: true,
      isActive: true
    });
    const data = { email: "joedoe@gmail.com", password: "testtest" };
    const response = await request(app).post("/api/auth/login").send(data);
    token = response.body;
  });

  after(async () => {
    await db.Appointment.destroy({ truncate: { cascade: true } });
    await db.Patient.destroy({ truncate: { cascade: true } });
    await db.User.destroy({ truncate: { cascade: true } });
  });

  it("Get all users", async () => {
    // act
    await makeUser({});
    await makeUser({});
    const response = await request(app).get("/api/users").set("authorization", `Bearer ${token}`);

    // assert
    expect(response.status).to.equal(200);
    // 2 added and 1 which is admin
    expect(response.body.rows).to.have.lengthOf(3);
  });

  it("Get all users filtered by name", async () => {
    // act
    await makeUser({ firstName: "Calumn" });
    await makeUser({ firstName: "Rowan" });
    const response = await request(app).get("/api/users?search=Calumn")
      .set("authorization", `Bearer ${token}`);

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
    const response = await request(app).get("/api/users?search=Calumn&role=Admin").set("authorization", `Bearer ${token}`);

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
    const response = await request(app).get("/api/users?role=Admin")
      .set("authorization", `Bearer ${token}`);

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(3);
  });
});

describe("POST users", async () => {
  let token;

  beforeEach(async () => {
    await db.User.destroy({ truncate: { cascade: true } });
    const salt = await bcrypt.genSaltSync(10, "a");
    await db.User.create({
      firstName: "Joe",
      lastName: "Doe",
      email: "joedoe@gmail.com",
      role: "Admin",
      password: bcrypt.hashSync("testtest", salt),
      isVerified: true,
      isActive: true
    });
    const data = { email: "joedoe@gmail.com", password: "testtest" };
    const response = await request(app).post("/api/auth/login").send(data);
    token = response.body;
  });

  after(async () => {
    await db.Appointment.destroy({ truncate: { cascade: true } });
    await db.Patient.destroy({ truncate: { cascade: true } });
    await db.User.destroy({ truncate: { cascade: true } });
  });

  it("Post one user", async () => {
    // arrange
    const user = returnUser();

    // act
    const response1 = await request(app).post("/api/users").send(user)
      .set("authorization", `Bearer ${token}`);
    const countUsers = await db.User.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(countUsers).to.equal(2);
  });

  it("Post two users with the same email", async () => {
    // arrange
    const user = returnUser();

    // act
    const response1 = await request(app).post("/api/users").send(user)
      .set("authorization", `Bearer ${token}`);
    const response2 = await request(app).post("/api/users").send(user)
      .set("authorization", `Bearer ${token}`);
    const countUsers = await db.User.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(response2.status).to.equal(400);
    expect(countUsers).to.equal(2);
  });
});
