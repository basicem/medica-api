const PAGINATION = {
  PAGE: 0,
  PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 1000,
};

const getLimitAndOffset = (page, pageSize) => {
  let defaultSize = PAGINATION.PAGE_SIZE;
  const autodefaulPage = PAGINATION.PAGE;

  if (pageSize > PAGINATION.MAX_PAGE_SIZE) {
    defaultSize = PAGINATION.MAX_PAGE_SIZE;
  } else if (pageSize < PAGINATION.PAGE) {
    defaultSize = PAGINATION.PAGE;
  }
  const limit = pageSize ? +pageSize : defaultSize;
  const offset = page ? (page - 1) * limit : autodefaulPage;
  return { limit, offset };
};

const paginate = ({
  count, rows, page, pageSize
}) => {
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
