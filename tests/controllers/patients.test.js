const chai = require("chai");
const request = require("supertest");

const { app } = require("../../startup");
const db = require("../../models");

const { expect } = chai;

describe("GET patients", async () => {
  beforeEach(async () => {
    await db.Patient.destroy({ truncate: { cascade: true } });
    await db.Patient.create({
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    });
    await db.Patient.create({
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Ahmed",
      lastName: "Riz",
      dateOfBirth: "1990-11-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "ahmedriz@gmail.com"
    });
  });

  it("Get all patients", async () => {
    // act
    const response = await request(app).get("/api/patients");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(2);
  });

  it("Get all patients filtered by name", async () => {
    // act
    const response = await request(app).get("/api/patients?search=Harry");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body.rows).to.have.lengthOf(0);
  });
});

describe("POST patients", async () => {
  beforeEach(async () => {
    await db.Patient.destroy({ truncate: { cascade: true } });
  });

  it("Post one patient", async () => {
    // arrange
    const patient1 = {
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    };
    // act
    const response1 = await request(app).post("/api/patients").send(patient1);
    const countPatients = await db.Patient.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(countPatients).to.equal(1);
  });

  it("Post patient with same email", async () => {
    // arrange
    const patient1 = {
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    };
    // act
    const response1 = await request(app).post("/api/patients").send(patient1);
    const response2 = await request(app).post("/api/patients").send(patient1);
    const countPatients = await db.Patient.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(response2.status).to.equal(400);
    expect(response2.body.error).to.equal("Patient with this email already exists");
    expect(countPatients).to.equal(1);
  });

  it("Post two different patients", async () => {
    // arrange
    const patient1 = {
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    };
    const patient2 = {
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "129-333-123",
      email: "janedoe@gmail.com"
    };
    // act
    const response1 = await request(app).post("/api/patients").send(patient1);
    const response2 = await request(app).post("/api/patients").send(patient2);
    const countPatients = await db.Patient.count();

    // assert
    expect(response1.status).to.equal(201);
    expect(response2.status).to.equal(201);
    expect(countPatients).to.equal(2);
  });
});
