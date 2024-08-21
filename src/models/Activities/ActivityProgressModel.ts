import ActivityDoneModel from "./ActivityDoneModel.ts";
import ActivitySaveDTO from "../../dto/activities/ActivitySaveDTO.tsx";
import ActivityDoneDTO from "../../dto/activities/ActivityDoneDTO.tsx";

class ActivityProgressModel {
  activityDone: ActivityDoneDTO;
  weekProgress: number;
  weekObjective: number;

  constructor(activityDone: ActivityDoneDTO, weekProgress: number, weekObjective: number) {
    this.activityDone = activityDone;
    this.weekProgress = weekProgress;
    this.weekObjective = weekObjective;
  }
}

export default ActivityProgressModel;
