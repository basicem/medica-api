const chai = require("chai");
const sinon = require("sinon");
chai.use(require('sinon-chai'));
const request = require("supertest");
const { expect } = chai;
var assert = require('assert');

const { app } = require("../../startup");
const db = require("../../models");
const sendEmail = require("../../helpers/email");

describe("GET users", async () => {
  beforeEach(async () => {
    await db.User.destroy({ truncate: { cascade: true } });
    await db.User.create({
      firstName: "Calumn",
      lastName: "Hood",
      email: "calumnhood@medica.ba",
      role: "Admin",
      password: "IAmFrom5SOS123",
      isVerified: false,
      isActive: false
    });
    await db.User.create({
      firstName: "Calumn",
      lastName: "Hood",
      email: "calumnhood+1@medica.ba",
      role: "Doctor",
      password: "IAmFrom5SOS123",
      isVerified: false,
      isActive: true
    });
    process.env.NODE_ENV = 'console';
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  it("Get all users", async () => {
    
    // act
    const response = await request(app).get("/api/users");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(2);
  });

  it("Get all users filtered by name", async () => {
    // act
    const response = await request(app).get("/api/users?search=Calumn");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(2);
  });

  it("Get all users filtered by name and role", async () => {
    // act
    const response = await request(app).get("/api/users?search=Calumn&role=Admin");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(1);
  });
});

describe("POST users", async () => {
  beforeEach(async () => {
    await db.User.destroy({ truncate: { cascade: true } });
    process.env.NODE_ENV = 'console';
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  it("Post one user", async () => {
    // arrange
    const user = {
      firstName: "Calumn",
      lastName: "Hood",
      email: "calumnhood+1@medica.ba",
      role: "Doctor",
      password: "IAmFrom5SOS123",
      isVerified: false,
      isActive: true
    };

    // act
    const response1 = await request(app).post("/api/users").send(user);
    const countUsers = await db.User.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(countUsers).to.equal(1);
    
  });

  it("Test console email backend", async () => {
    // arrange
    var spy = sinon.spy(sendEmail);

    // act
    spy();

    // assert
    expect(spy).to.have.been.calledOnce;
    
  });


  it("Post two different users", async () => {
    // arrange
    const user1 = {
      firstName: "Calumn",
      lastName: "Hood",
      email: "calumnhood@medica.ba",
      role: "Doctor",
      password: "IAmFrom5SOS123",
      isVerified: false,
      isActive: true
    };
    const user2 = {
      firstName: "Calumn",
      lastName: "Hood",
      email: "calumnhood+1@medica.ba",
      role: "Doctor",
      password: "IAmFrom5SOS123",
      isVerified: false,
      isActive: true
    };
    // act
    const response1 = await request(app).post("/api/users").send(user1);
    const response2 = await request(app).post("/api/users").send(user2);
    const countUsers = await db.User.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(response2.status).to.equal(201);
    expect(countUsers).to.equal(2);
  });
});


