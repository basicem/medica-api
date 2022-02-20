exports.status = (req, res) => {
  const obj = {
    status: "ok",
  };
  res.send(obj);
};
