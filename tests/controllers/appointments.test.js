const { faker } = require("@faker-js/faker");

const chai = require("chai");
chai.use(require("sinon-chai"));
const request = require("supertest");
const bcrypt = require("bcrypt");

const { expect } = chai;

const { app } = require("../../startup");
const db = require("../../models");

describe("GET appointments", async () => {
  let token;
  let doctor;
  let patient;

  before(async () => {
    const salt = await bcrypt.genSaltSync(10, "a");
    doctor = await db.User.create({
      firstName: "Joe",
      lastName: "Doe",
      email: "joedoe@gmail.com",
      role: "Doctor",
      password: bcrypt.hashSync("testtest", salt),
      isVerified: true,
      isActive: true
    });
    patient = await db.Patient.create({
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "janedoe@gmail.com",
      doctor_id: doctor.id,
    });
    const data = { email: "joedoe@gmail.com", password: "testtest" };
    const response = await request(app).post("/api/auth/login").send(data);
    token = response.body;
  });

  beforeEach(async () => {
    await db.Appointment.destroy({ truncate: { cascade: true } });
  });

  after(async () => {
    await db.Appointment.destroy({ truncate: { cascade: true } });
    await db.Patient.destroy({ truncate: { cascade: true } });
    await db.User.destroy({ truncate: { cascade: true } });
  });

  const makeAppointment = async (data) => {
    const start = new Date("2023-10-01").getTime();
    const end = new Date("2023-10-31").getTime();
    const {
      title = faker.lorem.words(10),
      date = faker.date.between(start, end),
      duration = "15 minutes",
      description = faker.lorem.sentence(),
      isVirtual = faker.datatype.boolean(),
      link = isVirtual ? faker.internet.url() : "",
      time = "15:00",
      status = faker.helpers.arrayElement(["Confirmed", "Pending", "Canceled"]),
      doctorId = doctor.id,
      patientId = patient.id,
    } = data;

    const [hours, minutes] = time.split(":");
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(parseInt(hours, 10));
    combinedDateTime.setMinutes(parseInt(minutes, 10));

    const numericValue = parseFloat(duration.match(/\d+(\.\d+)?/)[0]);
    const endDate = new Date(combinedDateTime.getTime() + numericValue * 60000);

    return db.Appointment.create({
      title,
      description,
      isVirtual,
      link,
      status,
      doctorId,
      patientId,
      startDate: combinedDateTime,
      endDate
    });
  };

  it("Get all appointments 1", async () => {
    // act
    await makeAppointment({});
    await makeAppointment({});
    const response = await request(app).get("/api/appointments?start=2023-10-01&end=2023-10-31")
      .set("authorization", `Bearer ${token}`);

    // assert
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(2);
  });

  it("Get all appointments 2", async () => {
    await makeAppointment({});
    await makeAppointment({});
    await makeAppointment({});
    await makeAppointment({});
    const response = await request(app).get("/api/appointments?start=2023-10-01&end=2023-10-31")
      .set("authorization", `Bearer ${token}`);

    // // assert
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(4);
  });

  it("Get all appointments 3", async () => {
    await makeAppointment({});
    const response = await request(app).get("/api/appointments?start=2023-12-01&end=2023-12-31")
      .set("authorization", `Bearer ${token}`);

    // // assert
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(0);
  });

  it("Get all appointments, unauthorised", async () => {
    await makeAppointment({});
    const response = await request(app).get("/api/appointments?start=2023-12-01&end=2023-12-31");

    // // assert
    expect(response.status).to.equal(401);
  });
});

describe("POST appointments", async () => {
  let token;
  let doctor;
  let patient;

  const start = new Date("2023-10-01").getTime();
  const end = new Date("2023-10-31").getTime();

  before(async () => {
    const salt = await bcrypt.genSaltSync(10, "a");
    doctor = await db.User.create({
      firstName: "Joe",
      lastName: "Doe",
      email: "joedoe@gmail.com",
      role: "Doctor",
      password: bcrypt.hashSync("testtest", salt),
      isVerified: true,
      isActive: true
    });
    patient = await db.Patient.create({
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "janedoe@gmail.com",
      doctor_id: doctor.id,
    });
    const data = { email: "joedoe@gmail.com", password: "testtest" };
    const response = await request(app).post("/api/auth/login").send(data);
    token = response.body;
  });

  beforeEach(async () => {
    await db.Appointment.destroy({ truncate: { cascade: true } });
  });

  after(async () => {
    await db.Appointment.destroy({ truncate: { cascade: true } });
    await db.Patient.destroy({ truncate: { cascade: true } });
    await db.User.destroy({ truncate: { cascade: true } });
  });

  const returnAppointment = (data) => {
    const {
      title = faker.lorem.words(10),
      date = faker.date.between(start, end),
      duration = "15 minutes",
      description = faker.lorem.sentence(),
      isVirtual = faker.datatype.boolean(),
      link = isVirtual ? faker.internet.url() : "",
      time = "15:00",
      status = faker.helpers.arrayElement(["Confirmed", "Pending", "Canceled"]),
      patientId = patient.id,
      reminders = []
    } = data;

    const appointment = {
      title,
      date,
      time,
      duration,
      description,
      isVirtual,
      link,
      status,
      patientId,
      reminders
    };

    return appointment;
  };

  it("Post one appointment", async function () {
    this.timeout(5000);

    // arrange
    const appointment = returnAppointment({});

    // act
    const response = await request(app)
      .post("/api/appointments")
      .send(appointment)
      .set("authorization", `Bearer ${token}`);

    // assert
    expect(response.status).to.equal(201);
    const countAppointments = await db.Appointment.count();
    expect(countAppointments).to.equal(1);
  });
});
