const PAGINATION = {
  PAGE: 0,
  PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 1000,
};

exports.pagination = (page, pageSize) => {
  let autoSize = PAGINATION.PAGE_SIZE;
  const autoPage = PAGINATION.PAGE;
  // maximim  size
  if (pageSize > PAGINATION.MAX_PAGE_SIZE) {
    autoSize = PAGINATION.MAX_PAGE_SIZE;
  }
  // negative size
  else if (pageSize < PAGINATION.PAGE) {
    autoSize = PAGINATION.PAGE;
  }
  const limit = pageSize ? +pageSize : autoSize;
  const offset = page ? (page - 1) * limit : autoPage;
  return { limit, offset };
};
