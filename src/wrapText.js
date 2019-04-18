// recieves an input string, column length, and a function to console.log(output current string

module.exports = function wrapText(text, length, output) {
  let currentLength = 0;
  let currentString = "";

  text.split(" ").forEach(word => {
    if (currentLength + word.length <= length) {
      currentString += word + " ";
      currentLength += word.length;
    } else {
      output(currentString);
      currentString = word + " ";
      currentLength = word.length;
    }
  });
  currentString.length > 0 ? output(currentString) : "";
};
