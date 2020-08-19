
export interface ISubject {
  code: string,
  name: string,
  normalisedName: string,
  creditHour: number,
  idealPeriod: number,
  prereq: string[],
  posreq: string[],
  required: boolean
}
