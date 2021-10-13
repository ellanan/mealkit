const ngrok = require('ngrok');
const openBrowser = require('react-dev-utils/openBrowser');
(async function () {
  const url = await ngrok.connect(3000);
  openBrowser(url);
})();
