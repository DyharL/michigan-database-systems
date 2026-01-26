import { parseMailLogs } from '../_lib/modules/01-mail-analytics.ts';

export const onRequest: PagesFunction = async () => {
  const sampleLog = `
From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008
From louis@media.berkeley.edu Fri Jan  4 18:10:48 2008
From stephen.marquard@uct.ac.za Fri Jan  4 09:12:18 2008
From zqian@umich.edu Thu Jan  3 16:34:40 2008
From rjlowe@iupui.edu Thu Jan  3 15:46:24 2008
  `;
  return new Response(JSON.stringify(parseMailLogs(sampleLog)), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
