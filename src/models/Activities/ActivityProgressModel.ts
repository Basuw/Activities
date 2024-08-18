import ActivitySaveModel from './ActivitySaveModel';

class ActivityProgressModel {
  activitySave: ActivitySaveModel;
  weekProgress: number;
  weekObjective: number;

  constructor(activitySave: ActivitySaveModel, weekProgress: number, weekObjective: number) {
    this.activitySave = activitySave;
    this.weekProgress = weekProgress;
    this.weekObjective = weekObjective;
  }
}

export default ActivityProgressModel;
