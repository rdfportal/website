/**
 * language-switcher.js
 * 
 * Checks the existence of the counterpart page (Japanese/English) via a HEAD request.
 * If the counterpart page returns a 404, the language switcher button is hidden to prevent
 * users from navigating to a broken page. This is particularly useful for auto-generated
 * paths like /news/ or /logs/ where translations might be missing.
 */
(function () {
  try {
    var switcherDiv = document.querySelector('.global-navigation .bottom div[data-current-lang]');
    var switcher = switcherDiv ? switcherDiv.querySelector('a') : null;
    if (!switcher || !switcherDiv) return;

    var targetUrl = switcher.getAttribute('href');
    if (!targetUrl) return;

    // Optimization: Verify existence only for likely dynamic paths (News, Logs) 
    // or generally if we want to be safe. "About" and "Home" are static and safe.
    // Checking everything incurs network requests.
    // Assuming /news/ and /logs/ are the primary dynamic collections.
    var checkNeeded = /\/(news|logs)\//.test(targetUrl) || /\/(news|logs)\//.test(window.location.pathname);

    if (checkNeeded) {
      fetch(targetUrl, { method: 'HEAD' })
        .then(function (res) {
          if (!res.ok) {
            switcherDiv.style.display = 'none';
          }
        })
        .catch(function (e) {
          // On error (e.g. network), hide to be safe
          switcherDiv.style.display = 'none';
        });
    }
  } catch (e) {
    console.error('Lang switcher check error', e);
  }
})();
