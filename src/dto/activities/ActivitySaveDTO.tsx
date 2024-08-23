import ActivityDTO from './ActivityDTO.tsx';

class ActivitySaveDTO {
    id: number;
    frequency: number;
    objective: number;
    activity: ActivityDTO;
    userId: number;

  constructor(id: number, frequency: number, objective: number, activity: ActivityDTO, userId: number) {
    this.id = id;
    this.frequency = frequency;
    this.objective = objective;
    this.activity = activity;
    this.userId = userId;
  }
}

export default ActivitySaveDTO;
