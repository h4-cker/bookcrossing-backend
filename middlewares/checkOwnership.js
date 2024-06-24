export default (req, res, next) => {
  const token = req.userId;

  if (token === req.params.id) {
    req.accountOwner = true;
  } else {
    req.accountOwner = false;
  }

  next();
};
