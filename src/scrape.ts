import * as jupiterScraper from './services/jupiter-web-parser';

/* eslint-disable-next-line max-len*/
const jupiterUrl = 'https://uspdigital.usp.br/jupiterweb/listarGradeCurricular?codcg=55&codcur=55041&codhab=0&tipo=N';

(async () => {
  await jupiterScraper.getCourseInfo(jupiterUrl, 'bcc');
})();
