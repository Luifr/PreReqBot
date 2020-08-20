import { bot } from "../telegram-bot";
import { normaliseString } from "../../helpers/string";
import { listSubjects } from "./list";
import { infoCommand } from "./info";
import { prereqCommand } from "./prereq";

export const runArglessCommand = (command: string) => {
  const commandExecuter: { [command: string]: (() => void) | undefined } = {
    'info': () => bot.sendMessage('Me mande o nome da materia!'),
    'prereq': () => bot.sendMessage('Me mande o nome da materia!'),
    'salvarmaterias': () => bot.sendMessage('Me mande seu historico escolar!'),
    'list': listSubjects
  }
  commandExecuter[command]?.();
}

export const runCommand = (command: string, arg: string) => {
  const commandExecuter: { [command: string]: ((arg: string) => void) | undefined } = {
    'info': infoCommand,
    'prereq': prereqCommand,
    'list': listSubjects
  };
  commandExecuter[command]?.(normaliseString(arg));
}
