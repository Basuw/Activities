import DayEnum from '../../models/Activities/DayEnum';

export interface UpdateActivitySaveDTO {
  frequency?: number;
  objective?: number;
  notes?: string;
  day?: DayEnum;
}
