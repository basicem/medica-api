const chai = require("chai");
const request = require("supertest");

const { app } = require("../../startup");
const db = require("../../models");

const { expect } = chai;

describe("Create doctor", async () => {
  it("Create doctor", async () => {
    const pa = await db.PracticeArea.create({
      id: 2,
      name: "Surgeon",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const requestData = {
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "Jane",
      lastName: "Driver",
      practiceArea: [pa.id],
      adress: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      workingHours: [
        { day: "monday", workTimeStart: "08:00", workTimeEnd: "18:00" },
        { day: "tuesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
        { day: "wednesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      ],
      email: "bbbv@atrijum.ba",
    };
    const { body, status } = await request(app)
      .post("/api/doctors")
      .send(requestData);

    expect(status).to.equal(201);
    expect(body.id).to.not.be.null;
  });
  it("Create doctor with existing email", async () => {
    const pa = await db.PracticeArea.create({
      id: 3,
      name: "Surgeon",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const requestData = {
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "Jane",
      lastName: "Driver",
      practiceArea: [pa.id],
      adress: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      workingHours: [
        { day: "monday", workTimeStart: "08:00", workTimeEnd: "18:00" },
        { day: "tuesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
        { day: "wednesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      ],
      email: "a@atrijum.ba",
    };
    await db.Doctor.create(requestData);
    const { body, status } = await request(app)
      .post("/api/doctors")
      .send(requestData);
    expect(status).to.equal(400);
    expect(body.error).to.equals("Doctor with this email already exists");
  });
});
