
// Only commands that do not recieve arguments
export const arglessCommands = [
  'salvarmaterias',
  'help',
  'materiasaprovadas'
] as const;
export type ArglessCommand = typeof arglessCommands[number];


// Commands that can run with or without argument
export const optionalArgCommands = [
  'list'
] as const;


// Commands that work with argument
export const argCommands = [
  'prereq',
  'info'
] as const;
export type ArgCommand = typeof argCommands[number] | typeof optionalArgCommands[number];


// All commands
export type Command = ArgCommand | ArglessCommand;
export const allCommands = [
  ...argCommands,
  ...arglessCommands,
  ...optionalArgCommands
];
