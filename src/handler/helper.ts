function generateHexColorCode() {
  // Generate a random hexadecimal number between 0 and 16777215
  let hexColorCode = Math.floor(Math.random() * 16777215).toString(16);

  // Pad the hexadecimal number with leading zeros if necessary
  while (hexColorCode.length < 6) {
    hexColorCode = "0" + hexColorCode;
  }

  // Prepend the "#" character to the hexadecimal color code
  hexColorCode = "#" + hexColorCode;

  return hexColorCode;
}

export { generateHexColorCode as colorCode };
