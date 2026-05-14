import DayEnum from '../../models/Activities/DayEnum';

export interface CreateActivitySaveDTO {
  frequency: number;
  objective: number;
  notes: string;
  day?: DayEnum;
  activity: { id: number };
  user: { id: number };
  activitySaveGroup?: { id: number };
}
