export const toSlug = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const convertDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

export const convertOptionToLabel = (options: { label: string; value: number }[], value: number) => {
  const option = options.find(option => option.value === value);
  return option ? option.label : '';
}