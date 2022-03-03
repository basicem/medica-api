const chai = require("chai");
const request = require("supertest");

const { app } = require("../../startup");
const db = require("../../models");

const { expect } = chai;

describe("POST doctors", async () => {
  afterEach(async () => {
    await db.DoctorPracticeArea.destroy({ truncate: { cascade: true } });
    await db.WorkingHours.destroy({ truncate: { cascade: true } });
    await db.PracticeArea.destroy({ truncate: { cascade: true } });
    await db.Doctor.destroy({ truncate: { cascade: true } });
  });

  it("Create doctor", async () => {
    // arrange
    const pa = await db.PracticeArea.create({
      name: "Surgeon",
    });
    const requestData = {
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "John",
      lastName: "Doe",
      practiceArea: [pa.id],
      address: "Sarajevska 71",
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
      email: "johndoe@atrijum.ba",
    };

    // act
    const { body, status } = await request(app)
      .post("/api/doctors")
      .send(requestData);

    // assert
    expect(status).to.equal(201);
    expect(body.id).to.not.be.null;
  });

  it("Create doctor with existing email", async () => {
    // arrange
    const practiceArea = await db.PracticeArea.create({
      name: "Family medicine",
    });
    const workingHours = [
      { day: "monday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      { day: "tuesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      { day: "wednesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
    ];
    const requestData = {
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "Jane",
      lastName: "Doe",
      practiceArea: [practiceArea.id],
      address: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      workingHours,
      email: "a@atrijum.ba",
    };

    const doctor = await db.Doctor.create({
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "Jane",
      lastName: "Doe",
      address: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      email: "a@atrijum.ba",
    });

    workingHours.forEach(async (wh) => {
      await db.WorkingHours.create({
        ...wh,
        doctorId: doctor.id,
      });
    });

    await db.DoctorPracticeArea.create({
      doctorId: doctor.id,
      practiceAreaId: practiceArea.id,
    });

    // act
    const { body, status } = await request(app)
      .post("/api/doctors")
      .send(requestData);

    // assert
    expect(status).to.equal(400);
    expect(body.error).to.equals("Doctor with this email already exists");
  });
});

describe("GET doctors", async () => {
  const doctorFilterName = "Joe";
  let practiceArea = null;

  beforeEach(async () => {
    await db.DoctorPracticeArea.destroy({ truncate: { cascade: true } });
    await db.WorkingHours.destroy({ truncate: { cascade: true } });
    await db.PracticeArea.destroy({ truncate: { cascade: true } });
    await db.Doctor.destroy({ truncate: { cascade: true } });

    practiceArea = await db.PracticeArea.create({
      name: "Dermatology",
    });
    const workingHours = [
      { day: "monday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      { day: "tuesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      { day: "wednesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
    ];
    const doctor1 = await db.Doctor.create({
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "Jane",
      lastName: "Driver",
      address: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      email: "jane@atrijum.ba",
    });
    const doctor2 = await db.Doctor.create({
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: doctorFilterName,
      lastName: "Driver",
      address: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      email: "joe@atrijum.ba",
    });

    workingHours.forEach(async (wh) => {
      await db.WorkingHours.create({
        ...wh,
        doctorId: doctor1.id,
      });
    });

    await db.DoctorPracticeArea.create({
      doctorId: doctor1.id,
      practiceAreaId: practiceArea.id,
    });

    workingHours.forEach(async (wh) => {
      await db.WorkingHours.create({
        ...wh,
        doctorId: doctor2.id,
      });
    });

    await db.DoctorPracticeArea.create({
      doctorId: doctor2.id,
      practiceAreaId: practiceArea.id,
    });
  });

  it("Get all doctors", async () => {
    // act
    const response = await request(app).get("/api/doctors");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(2);
  });

  it("Get all doctors filtered by name", async () => {
    // act
    const response = await request(app).get("/api/doctors?name=Joe");

    // assert
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(1);
  });

  it("Get all doctors filtered by practice area", async () => {
    // act
    const response = await request(app).get(
      `/api/doctors?practiceArea=${practiceArea.id}`
    );

    // assert
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(2);
  });

  it("Get doctors filtered by practice area and name", async () => {
    // act
    const response = await request(app).get(
      `/api/doctors?name=${doctorFilterName}&practiceArea=${practiceArea.id}`
    );
    // assert
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(1);
  });
});
