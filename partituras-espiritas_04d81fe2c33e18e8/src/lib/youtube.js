let youTubeApiPromise = null;

export function loadYouTubeApi() {
  return window.YT?.Player
    ? Promise.resolve(window.YT)
    : (youTubeApiPromise ||
        (youTubeApiPromise = new Promise((l) => {
          const window_onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            if (window_onYouTubeIframeAPIReady != null) {
              window_onYouTubeIframeAPIReady();
            }
            l(window.YT);
          };
          const f = document.createElement("script");
          f.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(f);
        })),
      youTubeApiPromise);
}
