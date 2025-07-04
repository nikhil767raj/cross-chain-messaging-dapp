
export const generateRandomHex = (length) => {
    let result = "0x";
    const characters = "abcdef0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };