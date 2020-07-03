import Bowser from "bowser";

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();

if (browserName === "Internet Explorer") {
  document.body.classList.add("internet-explorer");
}
