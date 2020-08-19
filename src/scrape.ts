import * as jupiterScraper from './jupiterWebParser';
(async () => {
  await jupiterScraper.getCourseInfo('https://uspdigital.usp.br/jupiterweb/listarGradeCurricular?codcg=55&codcur=55041&codhab=0&tipo=N', 'bcc');
})();