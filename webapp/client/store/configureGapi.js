export default function initGapi(cb) {
  let script = document.createElement('script');
  script.src = '//apis.google.com/js/platform.js';
  script.async = true;
  script.defer = true;
  script.onload = cb;

  let s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s);
};