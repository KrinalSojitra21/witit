export const getImageObject = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], "image.jpg", { type: blob.type });

  return { blob: URL.createObjectURL(blob), file };
};
