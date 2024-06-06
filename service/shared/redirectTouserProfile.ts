export function redirectTouserProfile(
  redirectUser: string,
  userId: string | undefined
) {
  let url = window.location.protocol + "//" + window.location.host;
  if (userId === redirectUser) {
    url = url + "/profile";
  } else {
    url = url + "/profile?user=" + redirectUser;
  }
  return url;
}
