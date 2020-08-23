import { bot } from '../telegram-bot';
import { normaliseString } from '../../helpers/string';
import { listSubjects } from './list';
import { infoCommand } from './info';
import { prereqCommand } from './prereq';
import { Command, ArgCommand } from '../../models/command';
import { helpCommand } from './help';
import { showMateriasAprovadas } from './materias-aprovadas';

export const runArglessCommand = (command: Command) => {
  const commandExecuter: { [command in Command]: () => void } = {
    info: () => bot.sendMessage('Me mande o nome da materia!'),
    prereq: () => bot.sendMessage('Me mande o nome da materia!'),
    salvarmaterias: () => bot.sendMessage('Me mande seu historico escolar!'),
    list: listSubjects,
    materiasaprovadas: showMateriasAprovadas,
    help: helpCommand
  };
  commandExecuter[command]();
};

export const runCommand = (command: ArgCommand, arg: string) => {
  const commandExecuter: { [command in ArgCommand]: (arg: string) => void } = {
    info: infoCommand,
    prereq: prereqCommand,
    list: listSubjects
  };
  commandExecuter[command](normaliseString(arg));
};
