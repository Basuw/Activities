import ActivityDoneModel from "./ActivityDoneModel.ts";
import ActivitySaveDTO from "../../dto/activities/ActivitySaveDTO.tsx";

class ActivityProgressModel {
  activityDone: ActivitySaveDTO;
  weekProgress: number;
  weekObjective: number;

  constructor(activityDone: ActivitySaveDTO, weekProgress: number, weekObjective: number) {
    this.activityDone = activityDone;
    this.weekProgress = weekProgress;
    this.weekObjective = weekObjective;
  }
}

export default ActivityProgressModel;
