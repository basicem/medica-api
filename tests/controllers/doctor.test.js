const chai = require("chai");
const request = require("supertest");

const { app } = require("../../startup");
const db = require("../../models");

const { expect } = chai;

describe("Doctor", async () => {
  afterEach(async () => {
    await db.DoctorPracticeArea.destroy({ truncate: { cascade: true } });
    await db.WorkingHours.destroy({ truncate: { cascade: true } });
    await db.PracticeArea.destroy({ truncate: { cascade: true } });
    await db.Doctor.destroy({ truncate: { cascade: true } });
  });
  it("Create doctor", async () => {
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
    const { body, status } = await request(app)
      .post("/api/doctors")
      .send(requestData);

    expect(status).to.equal(201);
    expect(body.id).to.not.be.null;
  });
  it("Create doctor with existing email", async () => {
    const pa = await db.PracticeArea.create({
      id: 2,
      name: "Family medicine",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const requestData = {
      image: "https://upload.wikimedia.org",
      title: "Mr.Prim.Prof.Dr.",
      firstName: "Jane",
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
      email: "a@atrijum.ba",
    };
    const workingHours = [
      { day: "monday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      { day: "tuesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
      { day: "wednesday", workTimeStart: "08:00", workTimeEnd: "18:00" },
    ];

    const practiceArea = [pa.id];

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

    practiceArea.forEach(async (practiceArea1) => {
      await db.DoctorPracticeArea.create({
        doctor_id: doctor.id,
        practice_area_id: practiceArea1,
      });
    });

    const { body, status } = await request(app)
      .post("/api/doctors")
      .send(requestData);

    expect(status).to.equal(400);
    expect(body.error).to.equals("Doctor with this email already exists");
  });

  it("Get all doctors", async () => {
    const pa = await db.PracticeArea.create({
      id: 3,
      name: "Dermatology",
      created_at: new Date(),
      updated_at: new Date(),
    });
    await request(app)
      .post("/api/doctors")
      .send({
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
        email: "jane@atrijum.ba",
      });
    await request(app)
      .post("/api/doctors")
      .send({
        image: "https://upload.wikimedia.org",
        title: "Mr.Prim.Prof.Dr.",
        firstName: "Joe",
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
        email: "joe@atrijum.ba",
      });

    const response = await request(app).get("/api/doctors?");
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(2);
  });

  it("Get all doctors with name Joe", async () => {
    const pa = await db.PracticeArea.create({
      id: 4,
      name: "Dermatology",
      created_at: new Date(),
      updated_at: new Date(),
    });
    await request(app)
      .post("/api/doctors")
      .send({
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
        email: "jane@atrijum.ba",
      });
    await request(app)
      .post("/api/doctors")
      .send({
        image: "https://upload.wikimedia.org",
        title: "Mr.Prim.Prof.Dr.",
        firstName: "Joe",
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
        email: "joe@atrijum.ba",
      });

    const response = await request(app).get("/api/doctors?name=Joe");
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(1);
  });
  it("Get all doctors with practice area Dermatology", async () => {
    const pa1 = await db.PracticeArea.create({
      id: 4,
      name: "Dermatology",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const pa2 = await db.PracticeArea.create({
      id: 1,
      name: "Surgeon",
      created_at: new Date(),
      updated_at: new Date(),
    });
    await request(app)
      .post("/api/doctors")
      .send({
        image: "https://upload.wikimedia.org",
        title: "Mr.Prim.Prof.Dr.",
        firstName: "Jane",
        lastName: "Driver",
        practiceArea: [pa1.id],
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
        email: "jane@atrijum.ba",
      });
    await request(app)
      .post("/api/doctors")
      .send({
        image: "https://upload.wikimedia.org",
        title: "Mr.Prim.Prof.Dr.",
        firstName: "Joe",
        lastName: "Driver",
        practiceArea: [pa2.id],
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
        email: "joe@atrijum.ba",
      });

    const response = await request(app).get("/api/doctors?practiceArea=4");
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(1);
  });
  it("Get all doctors where practice area is Dermatology and name is Joe", async () => {
    const pa = await db.PracticeArea.create({
      id: 4,
      name: "Dermatology",
      created_at: new Date(),
      updated_at: new Date(),
    });
    await request(app)
      .post("/api/doctors")
      .send({
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
        email: "jane@atrijum.ba",
      });
    await request(app)
      .post("/api/doctors")
      .send({
        image: "https://upload.wikimedia.org",
        title: "Mr.Prim.Prof.Dr.",
        firstName: "Joe",
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
        email: "joe@atrijum.ba",
      });

    const response = await request(app).get(
      "/api/doctors?name=Joe&practiceArea=4"
    );
    expect(response.status).to.equal(201);
    expect(response.body).to.have.lengthOf(1);
  });
});
