exports.pagination = (page, size) => {
  let autoSize = 25;
  const autoPage = 0;
  // maximim  size
  if (size > 1000) {
    autoSize = 1000;
  }
  // negative size
  else if (size < 1) {
    autoSize = 1;
  }
  const limit = size ? +size : autoSize;
  const offset = page ? (page - 1) * limit : autoPage;
  return { limit, offset };
};
