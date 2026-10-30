export const getDirectImageUrl = (a) => {
  if (!a) {
    return "";
  }
  if (a.includes("drive.google.com/file/d/")) {
    const l = a.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (l && l[1]) {
      return `https://drive.google.com/uc?export=view&id=${l[1]}`;
    }
  }
  return a;
};

export const getYouTubeId = (a) => {
  if (!a) {
    return null;
  }
  const l =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const o = a.match(l);
  return o && o[2].length === 11 ? o[2] : null;
};

export const getYouTubePlaylistId = (a) => {
  if (!a) {
    return null;
  }
  const l = a.match(/[?&]list=([^#&?]+)/);
  return l ? l[1] : null;
};

export const getDirectAudioUrl = (a) => {
  if (!a) {
    return "";
  }
  let l = null;
  if (a.includes("drive.google.com/file/d/")) {
    const o = a.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (o) {
      l = o[1];
    }
  } else if (a.includes("drive.google.com") && a.includes("id=")) {
    const o = a.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (o) {
      l = o[1];
    }
  }
  return l
    ? `https://drive.usercontent.google.com/download?id=${l}&export=download&authuser=0&confirm=t`
    : a;
};
