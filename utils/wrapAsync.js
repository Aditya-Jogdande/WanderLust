// in utils folder all the extra things like files and all we should keep in this folder

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
