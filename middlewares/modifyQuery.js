export default (req, res, next) => {
  const query = req.query;

  if (!query) {
    next();
  }

  const bookMultipleParams = ["author", "genre", "language", "releaseYear"];
  const bookSingleParams = ["name", "ISBN"];

  req.bookQueryParams = {};

  for (const param of bookMultipleParams) {
    if (!query[param]) {
      continue;
    }

    const splittedParam = query[param].split("+");
    req.bookQueryParams[param] = { $in: splittedParam };
  }

  for (const param of bookSingleParams) {
    if (!query[param]) {
      continue;
    }

    if (param == "name") {
      req.bookQueryParams[param] =
        query[param][0].toUpperCase() + query[param].slice(1).toLowerCase();

      continue;
    }

    req.bookQueryParams[param] = query[param];
  }

  req.AdQueryParams = {};

  const adMultipleParams = ["type"];

  for (const param of adMultipleParams) {
    if (!query[param]) {
      continue;
    }

    const splittedParam = query[param].split("+");
    req.AdQueryParams[param] = { $in: splittedParam };
  }

  next();
};
