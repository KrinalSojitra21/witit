export const getRecentTimeFromTimeStamp = (time: string) => {
  let timeAgo = "";

  const currentTime = new Date().getTime() as number;
  const targetTime = new Date(time).getTime() as number;
  const timeDifference = currentTime - targetTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    timeAgo = `${seconds} sec ago`;
  } else if (minutes < 60) {
    timeAgo = `${minutes} min ago`;
  } else if (hours < 24) {
    timeAgo = `${hours} hr ago`;
  } else if (days < 30) {
    timeAgo = `${days} day ago`;
  } else if (months < 12) {
    timeAgo = `${months} month ago`;
  } else {
    timeAgo = `${years} year ago`;
  }
  return timeAgo;
};
