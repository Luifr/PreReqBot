import { grade } from "../db";
import { ISubject } from "../models";

export const buildPreReqMessage = (subject: ISubject, showSubject = true) => {
  const prereqs = subject.prereq;
  if (prereqs.length === 0) {
    const headText = showSubject ? `${subject.name} não` : 'Não';
    return `${headText} possui pre requisitos`;
  }
  else {
    const prereqsText = "--- " + prereqs.map(reqCode => grade[reqCode].name).join('\n--- ');

    const headText = showSubject ? `${subject.name} tem` : 'Tem';
    const bodyText = prereqs.length === 1 ? 'o seguinte prerequisito' : 'os seguites pre requisitos';
    return `${headText} ${bodyText}:\n${prereqsText}`;
  }
}

export const buildPosReqMessage = (subject: ISubject, showSubject = true) => {
  const posreqs = subject.posreq;
  if (posreqs.length === 0) {
    const headText = showSubject ? `${subject.name} não` : 'Não';
    return `${headText} tranca nenhuma materia`;
  }
  else {
    const posreqText = "--- " + posreqs.map(reqCode => grade[reqCode].name).join('\n--- ');

    const headText = showSubject ? `${subject.name} tranca` : 'Tranca';
    const bodyText = posreqs.length === 1 ? 'a seguinte materia' : 'as seguites materias';
    return `${headText} ${bodyText}:\n${posreqText}`;
  }
}