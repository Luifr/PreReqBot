import axios from 'axios';
import cheerio from 'cheerio';
import { normaliseString } from '../helpers/string';
import { writeFileSyncRecursive } from '../helpers/file-sytem';
import { ISubject } from '../models';

const webPageGet = async (pageUrl: string) => {
  console.log('GET method to ', pageUrl);
  // Requesting the url
  return axios({
    method: 'get',
    url: pageUrl,
    responseType: 'arraybuffer'
  }).then((res) => {
    return cheerio.load(res.data.toString('latin1'), {
      decodeEntities: true
    });
  }).catch((err) => {
    throw Error('Error on web parser: ' + err);
  });
};

export const getCourseInfo = async (pageUrl: string, course: string) => {
  return Promise.all([
    getCourseCurriculum(pageUrl, course),
    getCourseSubjects(pageUrl, course)
  ]);
};

export const getCourseCurriculum = async (pageUrl: string, course: string) => {
  const $ = await webPageGet(pageUrl);
  if ($ === undefined) {
    return;
  }
  const start = $('a', '.txt_verdana_8pt_gray');
  const subjects: {[key: string]: ISubject} = {};
  start.each((_, elem) => {
    const ref = $(elem);
    const refParent = ref.parent();
    const refGrandParent = refParent.parent();
    const refParentNext = refParent.next();

    let nextPrereq = refGrandParent.next();
    let nextPrereqTextAux;
    let codeAux;
    const prereqCodes: string[] = [];


    const code = ref.html()!.trim().toLocaleLowerCase();
    const name = refParentNext.text().trim();

    while (nextPrereq.children().children().text().indexOf('Requisito') !== -1) {
      nextPrereqTextAux = nextPrereq.children().children().children().text().trim();
      codeAux = nextPrereqTextAux.substring(0, nextPrereqTextAux.indexOf(' ')).toLocaleLowerCase();
      prereqCodes.push(codeAux);
      nextPrereq = nextPrereq.next();

      if (subjects[codeAux]) {
        subjects[codeAux].posreq.push(code);
      }
    }

    subjects[code] = {
      code: code,
      name: name,
      normalisedName: normaliseString(name),
      creditHour: +refParentNext.next().text().trim(),
      idealPeriod: Number.parseInt(refGrandParent.prevAll('[bgcolor="#CCCCCC"]')
        .children().children().children().text().substring(0, 2)),
      prereq: prereqCodes,
      posreq: [],
      required: refGrandParent.prevAll('[bgcolor="#658CCF"]')
        .children().children().text().indexOf('Optativas') === -1
    };
  });
  const curriculum = JSON.stringify(subjects, null, 2);
  writeFileSyncRecursive(`./jupiter/grade/${course}.json`, curriculum);
};

export const getCourseSubjects = async (pageUrl: string, course: string) => {
  const $ = await webPageGet(pageUrl);
  if ($ === undefined) {
    return;
  }
  let fileText = '';
  const start = $('a', '.txt_verdana_8pt_gray');
  const subjects: { name: string, normname: string, minname: string, code: string }[] = [];
  start.each((i, elem) => {
    const ref = $(elem);
    const refParent = ref.parent();
    const refParentNext = refParent.next();

    const code = ref.html()!.trim().toLocaleLowerCase();
    const name = refParentNext.text().trim();
    const normname = normaliseString(name);
    const minname = normname.replace(/\s/g, '').replace(/\([^)]*\)/g, '');

    subjects[i] = { name: name, normname: normname, minname: minname, code: code };

    fileText += `const ${minname} = "${code}";\n`;
  });

  fileText += '\nconst map = {\n\n';

  for (const sub of subjects) {
    fileText += `\t"${sub.code}" : ${sub.minname},\n`;
    fileText += `\t"${sub.normname}" : ${sub.minname},\n`;
    const newName = sub.normname.replace(/\([^)]*\)/g, '');
    if (newName !== sub.normname) {
      fileText += `\t"${newName}" : ${sub.minname},\n`;
    }
    fileText += '\n';
  }

  fileText += '}\n\nmodule.exports = map;';
  writeFileSyncRecursive(`./jupiter/maps/${course}.js`, fileText);
};
