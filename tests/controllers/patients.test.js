const chai = require("chai");
const request = require("supertest");

const { app } = require("../../startup");
const db = require("../../models");

const { expect } = chai;

describe("GET patients", async () => {
  beforeEach(async () => {
    await db.Patient.destroy({ truncate: { cascade: true } });
    await db.Patient.create({
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    });
    await db.Patient.create({
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
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
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
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
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
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
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    };
    const patient2 = {
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
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

describe("DELETE patients", async () => {
  beforeEach(async () => {
    await db.Patient.destroy({ truncate: { cascade: true } });
  });

  it("Delete patient", async () => {
    // arrange
    const patient1 = {
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    };
    // act
    const response1 = await db.Patient.create(patient1);
    const response2 = await request(app).delete(`/api/patients/${response1.id}`);
    const countPatients = await db.Patient.count();

    // assert
    expect(countPatients).to.equal(0);
  });
});

describe("PUT patients", async () => {
  beforeEach(async () => {
    await db.Patient.destroy({ truncate: { cascade: true } });
  });

  it("Edit patient", async () => {
    // arrange
    const patient1 = {
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAEDCAMAAAAGD5H5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMDc1NjkwQzREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMDc1NjkwRDREOUUxMUU0OEQ5M0VGQ0NFNTcyRTlEQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwNzU2OTBBNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwNzU2OTBCNEQ5RTExRTQ4RDkzRUZDQ0U1NzJFOURDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b3CoowAAADNQTFRFvL7A5+jp3N3ex8nL0dPUv8HDxcbI5OXm19ja3uDhzM7Q1NbX4uPkz9DSwcPFysvN2dvcW+APYwAAAzFJREFUeNrs3d12oyAUQOGAgqBBff+nndXVlSr1J5rYleGc/d3OTbsbFAg6txsAAAAAAAAAAAAAAAAAAAAAAADE86mzXfKKC1TWfLOV1gS1mXQ6E3RmLmhMMJjcoLDB/VeDOx8DY1rlVwOdVwS7aGBpYAwNFF4UR8bCLS0a1Ooa9IsGvfapss7Jsov5FdGp3DuYz5YbXXsI7jHw3XRvsI9PgdPxcYhx2kQJX5+FJkxbKDZqiBD27oJJxTQh7C0RKxU3iLC3TvaNhrtkeFwE08o/tiqmCj8JzNqlL2qYL00JGrc/awoKEqzPiFwjPUJ4Pin0wiOEI/Ni2RHCsaXBLIK4r57S0dXRLIKwzfb2+AJRaoT2zBpZZoTh3DbBLILGLyEBABDC28/4n76UqMxnVDSgAQ1oQAMa0IAGNKABDQprEP9ymVRIgz/9yWhAAxrQgAY0ENGgr7+OW8Wu19tgerC5c0obhPkc0qlskD+wEjU2+L2eSgob2GsfYyyxgbt4wVtig+ri5xhLbNDSYOU9BzsNRqd+LNRmVHJN3Dw04I8cSCzy3jgevTe6+9bDHcU38Edfe/I9nxwlNsheBbXzOw7HjucKWDPZrc/6z3M8T0ZDqWvntnl+T7AHn90odg/FtWM0d5u2/8Tp6G8mdy9tdlz/yasQ5DbI3wfRaWxQH19aymmQv+phMZ/eGQ1iGrg431d098V8upPfYMw2V8czJwukNAjZDvOwdrpiczQIaZCybfa+WT1i0olu0OZLB3vunI2IBj5/NVbaOmsU5TbIZoRhsbJ+ut8koMGv+2CIO6fOvMwGLp44eRdlNrCnjh/WEhuEk2cwvbwG9dlzqFFcg/b8YdxaWIOXDjV7UQ1880qDKKlB/1KC5WgouMGpicFc04tp8GqCxTsly20QzOuSjAbdOw+r5KOh2O+Z3ntixwpo8GaCfDSU2cA37zaYj4Yyzx+8nSAbDUWexYnmAqnoBkN9hVT8feFKNKABDWhAAxrQoMgGvP+A92DQgAY0oAENaEADGtCABjSY6+vPUPjf4AIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoM4/AQYAtiAriOWSGW8AAAAASUVORK5CYII=",
      firstName: "Joe",
      lastName: "Doe",
      dateOfBirth: "1990-01-07",
      address: "Sarajevska 77",
      city: "Sarajevo",
      phoneNumber: "888-120-123",
      email: "joedoe@gmail.com"
    };
    // act
    const response1 = await db.Patient.create(patient1);
    await request(app).put(`/api/patients/${response1.id}`).send({ ...patient1, firstName: "Joe Joseph" });
    const findPatient = await db.Patient.findOne(
      { where: response1.id }
    );

    // assert
    expect(findPatient.firstName).to.equal("Joe Joseph");
    expect(findPatient.lastName).to.equal("Doe");
  });
});
