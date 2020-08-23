import { normaliseString } from '../../helpers/string';
import { ArgCommand, Command } from '../../models/command';
import { PreReqBot } from '../telegram-bot';
import { helpCommand } from './help';
import { infoCommand } from './info';
import { listSubjects } from './list';
import { showMateriasAprovadas } from './materias-aprovadas';
import { prereqCommand } from './prereq';

export const runArglessCommand = (bot: PreReqBot, command: Command) => {
  const commandExecuter: { [command in Command]: (bot: PreReqBot) => void } = {
    info: () => bot.sendMessage('Me mande o nome da materia!'),
    prereq: () => bot.sendMessage('Me mande o nome da materia!'),
    salvarmaterias: () => bot.sendMessage('Me mande seu historico escolar!'),
    list: listSubjects,
    materiasaprovadas: showMateriasAprovadas,
    help: helpCommand
  };

  commandExecuter[command](bot);
};

export const runCommand = (bot: PreReqBot, command: ArgCommand, arg: string) => {
  const commandExecuter: { [command in ArgCommand]: (bot: PreReqBot, arg: string) => void } = {
    info: infoCommand,
    prereq: prereqCommand,
    list: listSubjects
  };

  commandExecuter[command](bot, normaliseString(arg));
};
