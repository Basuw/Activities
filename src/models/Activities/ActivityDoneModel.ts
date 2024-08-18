import ActivitySaveModel from './ActivitySaveModel';
import StatusEnum from './StatusEnum';

class ActivityDoneModel {
  id: number;
  achievement: number;
  doneOn: Date;
  activitySave: ActivitySaveModel;
  mark: number;
  notes: string;
  status: StatusEnum;
  duration: Date;

  constructor(
    id: number,
    achievement: number,
    doneOn: Date,
    activitySave: ActivitySaveModel,
    mark: number,
    notes: string,
    status: StatusEnum,
    duration: Date
  ) {
    this.id = id;
    this.achievement = achievement;
    this.doneOn = doneOn;
    this.activitySave = activitySave;
    this.mark = mark;
    this.notes = notes;
    this.status = status;
    this.duration = duration;
  }
}

export default ActivityDoneModel;
