import StatusEnum from '../../models/Activities/StatusEnum';

export interface CreateActivityDoneDTO {
  achievement: number;
  mark: number;
  notes: string;
  activitySave: { id: number };
  status: StatusEnum;
  doneOn: Date;
  duration?: Date;
}
