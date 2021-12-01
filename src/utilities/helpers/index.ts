export const convertSelectsForAggregate = (selects: string) =>
  selects.split(" ").reduce((aggregate, current) => {
    return { ...aggregate, [current]: 1 };
  }, {});

export const capitalizeFirstLetter = (sentence: string) =>
  sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
