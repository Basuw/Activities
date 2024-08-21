class ActivitySaveDTO {
    id: number;
    frequency: number;
    objective: number;
    activityId: number;
    userId: number;

  constructor(id: number, frequency: number, objective: number, activityId: number, userId: number) {
    this.id = id;
    this.frequency = frequency;
    this.objective = objective;
    this.activityId = activityId;
    this.userId = userId;
  }
}

export default ActivitySaveDTO;
