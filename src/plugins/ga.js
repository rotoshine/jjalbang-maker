import router from '~router'
/*
 ** Only run on client-side and only in production mode
 */
if (process.env.NODE_ENV === 'production') {
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
  ga('create', 'UA-49604777-4', 'auto');
  router.afterEach((to, from) => {
    /*
     ** We tell Google Analytic to add a page view
     */
    ga('set', 'page', to.fullPath);
    ga('send', 'pageview');
  });
}
