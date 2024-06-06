export const saveDataLocal = (key: string, value: any, document: any) => {
  document.cookie = `${key}=${JSON.stringify(value)}`;
};

export const getDataLocal = async (cname: string, document: any) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length + 1, c.length - 1);
    }
  }
  return "";
};

export const deleteDataLocal = (name: string, document: any) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
