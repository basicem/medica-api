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
      id: 1,
      name: "Surgeon",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const requestData = {
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "John",
      lastName: "Doe",
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
      id: 2,
      name: "Family medicine",
      created_at: new Date(),
      updated_at: new Date(),
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
      adress: "Sarajevska 71",
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
      adress: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      email: "a@atrijum.ba",
    });

    workingHours.forEach(async (workingHours1) => {
      await db.WorkingHours.create({
        ...workingHours1,
        doctor_id: doctor.id,
      });
    });

    await db.DoctorPracticeArea.create({
      doctor_id: doctor.id,
      practice_area_id: practiceArea.id,
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
  beforeEach(async () => {
    await db.DoctorPracticeArea.destroy({ truncate: { cascade: true } });
    await db.WorkingHours.destroy({ truncate: { cascade: true } });
    await db.PracticeArea.destroy({ truncate: { cascade: true } });
    await db.Doctor.destroy({ truncate: { cascade: true } });

    const practiceArea = await db.PracticeArea.create({
      id: 3,
      name: "Dermatology",
      created_at: new Date(),
      updated_at: new Date(),
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
      adress: "Sarajevska 71",
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
      firstName: "Joe",
      lastName: "Driver",
      adress: "Sarajevska 71",
      city: "Sarajevo",
      zip: "71000",
      country: "Bosnia and Hercegovina",
      phoneNumber: "123-060-459",
      website: "www.house.com",
      email: "joe@atrijum.ba",
    });

    workingHours.forEach(async (workingHours1) => {
      await db.WorkingHours.create({
        ...workingHours1,
        doctor_id: doctor1.id,
      });
    });

    await db.DoctorPracticeArea.create({
      doctor_id: doctor1.id,
      practice_area_id: practiceArea.id,
    });

    workingHours.forEach(async (workingHours1) => {
      await db.WorkingHours.create({
        ...workingHours1,
        doctor_id: doctor2.id,
      });
    });

    await db.DoctorPracticeArea.create({
      doctor_id: doctor2.id,
      practice_area_id: practiceArea.id,
    });
  });
  it("Get all doctors", async () => {
    // act
    const response = await request(app).get("/api/doctors?");

    // assert
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(2);
  });

  it("Get all doctors with name Joe", async () => {
    // act
    const response = await request(app).get("/api/doctors?name=Joe");

    // assert
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(1);
  });
  it("Get all doctors with practice area Dermatology", async () => {
    // act
    const response = await request(app).get("/api/doctors?practiceArea=3");

    // assert
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(2);
  });
  it("Get all doctors where practice area is Dermatology and name is Joe", async () => {
    // act
    const response = await request(app).get(
      "/api/doctors?name=Joe&practiceArea=3"
    );
    // assert
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(1);
  });
});
