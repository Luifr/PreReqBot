import { PreReqBot } from '../telegram-bot';

export const helpCommand = (bot: PreReqBot) => {
  const contact = process.env.DEV_CONTACT;
  const contactText = contact ?
    `Qualquer duvida ou sugestão, so chamar: ${contact}` :
    '';
  /* eslint-disable max-len */
  bot.sendMessage(
    'Olar eu posso te mostrar informações uteis sobre as materias do seu curso!\n' +
    'Comandos disponiveis:\n\n' +
    ' - /help: mostra essa mensage aqui\n' +
    ' - /salvarmaterias: depois de mandar esse comando, me envie seu resumo escolar e eu vou salvar as materias que voce ja foi aprovado, e então posso de dar dados uteis atraves de outros comandos!\n' +
    ' - /materiasaprovadas: mostra suas materias aprovadas, para isso voce precisa usar o /salvarmaterias primeiro\n' +
    ' - /info: mostra informações sobre uma materia, voce pode me falar o nome da materia junto com o comando ou na proxima mensagem\n' +
    ' - /prereq: mostra os prerequisitos de uma materia, voce pode me falar o nome da materia junto com o comando ou na proxima mensagem\n' +
    ' - /list: mostra todas as materias do seu curso, voce pode filtrar a lista de materias, mande o que voce quiser usar para filtar junto com o comando\n' +
    ' -- Ex: /list comp\n' +
    ' -- Mostra todas as materias que incluem comp no nome\n' +
    `\n${contactText}`
  );
};
