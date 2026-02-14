export const navToElement = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};
