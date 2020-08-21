
// Only commands that do not recieve arguments
export type ArglessCommand = typeof arglessCommands[number];
export const arglessCommands = [
  'salvarmaterias',
  'help',
  'materiasaprovadas',
] as const;


// Commands that work with argument
export type ArgCommand = typeof argCommands[number] | typeof optionalArgCommands[number];
export const argCommands = [
  'prereq',
  'info',
] as const;

// Commands that can run with or without argument
export const optionalArgCommands = [
  'list'
] as const;

// All commands
export type Command = ArgCommand | ArglessCommand;
export const allCommands = [
  ...argCommands,
  ...arglessCommands,
  ...optionalArgCommands
];
