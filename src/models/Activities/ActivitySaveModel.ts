import ActivityDTO from '../../dto/activities/ActivityDTO';
import UserModel from '../UserModel';

class ActivitySaveModel {
  id: number;
  frequency: number;
  objective: number;
  time: Date;
  activity: ActivityDTO;
  day: string;
  notes: string;
  user: UserModel;
  activitySaveGroupId: number | null;

  constructor(
    id: number,
    frequency: number,
    objective: number,
    time: Date,
    activity: ActivityDTO,
    day: string,
    notes: string,
    user: UserModel,
    activitySaveGroupId: number | null = null,
  ) {
    this.id = id;
    this.frequency = frequency;
    this.objective = objective;
    this.time = time;
    this.activity = activity;
    this.day = day;
    this.notes = notes;
    this.user = user;
    this.activitySaveGroupId = activitySaveGroupId;
  }
}

export default ActivitySaveModel;
