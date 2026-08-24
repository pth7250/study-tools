export function setResult(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
  element.classList.add("show");
}

export function runWithResult(element, callback) {
  try {
    callback();
  } catch (error) {
    setResult(element, error.message, true);
  }
}
