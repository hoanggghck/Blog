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

export const timeAgo = (
  createdAt: Date | string | null | undefined,
): string => {
  if (!createdAt) return '';

  const createdDate = new Date(createdAt);

  if (isNaN(createdDate.getTime())) return '';

  const now = Date.now();
  const diffMs = now - createdDate.getTime();

  if (diffMs < 0) {
    return 'Vừa xong';
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (minutes < 1) {
    return 'Vừa xong';
  }

  if (minutes < 60) {
    return `${minutes} phút trước`;
  }

  if (hours < 12) {
    return `${hours} tiếng trước`;
  }

  return createdDate.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
};
