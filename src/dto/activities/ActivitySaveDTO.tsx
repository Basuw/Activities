import ActivityDTO from './ActivityDTO.tsx';

class ActivitySaveDTO {
    id: number;
    frequency: number;
    objective: number;
    activity: ActivityDTO;
    userId: number;
    activitySaveGroupId: number | null;

  constructor(id: number, frequency: number, objective: number, activity: ActivityDTO, userId: number, activitySaveGroupId: number | null = null) {
    this.id = id;
    this.frequency = frequency;
    this.objective = objective;
    this.activity = activity;
    this.userId = userId;
    this.activitySaveGroupId = activitySaveGroupId;
  }
}

export default ActivitySaveDTO;
