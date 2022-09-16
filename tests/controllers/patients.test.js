const chai = require("chai");
const request = require("supertest");

const { app } = require("../../startup");
const db = require("../../models");

const { expect } = chai;

describe("GET patients", async () => {
  beforeEach(async () => {
    await db.Patient.destroy({ truncate: { cascade: true } });
    const patient1 = await db.Patient.create({
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Joe",
      lastName: "Doe",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    });
    const patient2 = await db.Patient.create({
      image: "https://variety.com/wp-content/uploads/2021/10/Riz-Ahmed.jpg",
      firstName: "Ahmed",
      lastName: "Riz",
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
