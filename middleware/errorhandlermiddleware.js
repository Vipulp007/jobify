const errorhandlermiddleware = (err, req, res, next) => {
  const defaultError = {
    status: err.statusCode || 500,
    message: err.message || 'Error occur in providing data',
  };
  if (err.name == 'ValidationError') {
    (defaultError.status = 500), (defaultError.message = err.message);
  }
  res.status(defaultError.status).send({ msg: defaultError.message });
  // res.status(500).send({ msg: err });
};
export default errorhandlermiddleware;
