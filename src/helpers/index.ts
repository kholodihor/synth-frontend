export const cutString = (str: string): string => {
  return str.split(" ").slice(0, 15).join(" ") + "...";
};

export const replaceUrl = (url: string): string => {
  return url.replace("watch?v=", "embed/");
};

export const getFirstLetters = (name: string): string => {
  const words = name.split(" ");
  const firstLetters = words.map((word) => word.charAt(0).toUpperCase());
  return firstLetters.join("");
};

