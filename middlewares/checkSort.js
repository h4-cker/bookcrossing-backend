export default (req, res, next) => {
  const query = req.query;

  if (query.sort) {
    req.sort = parseInt(query.sort);
    delete query.sort;
  }

  next();
};
