const notfoundmiddleware = (req, res) => {
  res.status(400).send('no route exist');
};

export default notfoundmiddleware;
