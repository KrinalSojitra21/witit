type Obj = {
  [key: string]: any;
};

export const convertEmptyToNull = (obj: Obj): Obj => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively process nested objects
        obj[key] = convertEmptyToNull(obj[key]);
      } else if (obj[key] === "") {
        // Convert empty string to null
        obj[key] = null;
      }
    }
  }
  return obj;
};
