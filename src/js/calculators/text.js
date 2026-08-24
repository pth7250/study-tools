export function countCharacters(text) {
  const characters = Array.from(text);
  const withoutWhitespace = Array.from(text.replace(/\s/g, ""));

  return {
    withWhitespace: characters.length,
    withoutWhitespace: withoutWhitespace.length
  };
}

export function calculateNeisBytes(text) {
  let bytes = 0;

  for (const character of text) {
    bytes += /[\x00-\x7F]/.test(character) ? 1 : 3;
  }

  return bytes;
}
