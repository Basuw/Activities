import ActivityDoneModel from "./ActivityDoneModel.ts";

class ActivityProgressModel {
  activityDone: ActivityDoneModel;
  weekProgress: number;
  weekObjective: number;

  constructor(activityDone: ActivityDoneModel, weekProgress: number, weekObjective: number) {
    this.activityDone = activityDone;
    this.weekProgress = weekProgress;
    this.weekObjective = weekObjective;
  }
}

export default ActivityProgressModel;
