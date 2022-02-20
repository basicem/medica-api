const db = require("../models");

exports.create = (req, res) => {
  const d = {
    image: req.body.image,
    title: req.body.title,
    firstName: req.body.title,
    lastName: req.body.title,
    practiceArea: req.body.title,
    adress: req.body.title,
    city: req.body.title,
    zip: req.body.title,
    country: req.body.title,
    phoneNumber: req.body.title,
    website: req.body.title,
    workingHours: req.body.title,
    email: req.body.title,
  };

  db.Doctor.create(d)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Doctor.",
      });
    });
};
