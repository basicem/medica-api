const PAGINATION = {
  PAGE: 0,
  PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 1000,
};

const getLimitAndOffset = (page, pageSize) => {
  // Rename to defaultSize
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

const paginate = ({ count, rows, page, pageSize }) => {
  // const { limit } = getLimitAndOffset(page, pageSize);
  const totalPages = Math.ceil(count / +pageSize);
  const nextPage = totalPages > +page ? +page + 1 : null;
  const previousPage = +page === 1 ? null : +page - 1;

  return {
    count,
    nextPage,
    previousPage,
    totalPages,
    rows,
  };
};

module.exports = {
  paginate,
  getLimitAndOffset,
};
