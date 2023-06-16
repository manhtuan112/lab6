const handleError = (message, callback) => {
  callback(message);
  const timeout = setTimeout(() => {
    callback("");
    clearTimeout(timeout);
  }, 2000);
};
export default handleError;
