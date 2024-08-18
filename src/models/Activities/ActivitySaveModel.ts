import ActivityModel from './ActivityModel';
import UserModel from '../UserModel';

class ActivitySaveModel {
  id: number;
  frequency: number;
  objective: number;
  time: Date;
  activity: ActivityModel;
  user: UserModel;

  constructor(
    id: number,
    frequency: number,
    objective: number,
    time: Date,
    activity: ActivityModel,
    user: UserModel
  ) {
    this.id = id;
    this.frequency = frequency;
    this.objective = objective;
    this.time = time;
    this.activity = activity;
    this.user = user;
  }
}

export default ActivitySaveModel;
