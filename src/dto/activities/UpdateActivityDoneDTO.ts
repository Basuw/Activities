export interface UpdateActivityDoneDTO {
  achievement: number;
  status: string;
  mark: number;
  notes: string;
  doneOn: Date;
  duration?: Date;
}
