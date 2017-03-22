export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + ' years ago';
  }
  if (interval == 1) {
    return interval + ' year ago';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' months ago';
  }
  if (interval == 1) {
    return interval + ' month ago';
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' days ago';
  }
  if (interval == 1) {
    return interval + ' day ago';
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' hours ago';
  }
  if (interval == 1) {
    return interval + ' hour ago';
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + ' minutes ago';
  }
  if (interval == 1) {
    return interval + ' minute ago';
  }
  return '<1 minute ago';
}

export function timeBackString(days) {
  var interval = Math.floor(days / 365);
  if (interval > 1) {
    return interval + ' years back';
  }
  if (interval == 1) {
    return interval + ' year back';
  }
  interval = Math.floor(days / 30);
  if (interval > 1) {
    return interval + ' months back';
  }
  if (interval == 1) {
    return interval + ' month back';
  }
  return days + ' days back';
}
