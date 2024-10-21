import PostActivityDTO from './PostActivityDTO.tsx';
import PostUserDTO from './PostUserDTO.tsx';
import DayEnum from '../../../models/Activities/DayEnum.ts';

class PostActivitySaveDTO {
    frequency: number;
    objective: number;
    time?: Date;
    day?: DayEnum;
    notes: string;
    activity: PostActivityDTO;
    user: PostUserDTO;

  constructor(frequency: number, objective: number,notes: string, activity: PostActivityDTO, user: PostUserDTO,day?: DayEnum,time?: Date) {
    this.frequency = frequency;
    this.objective = objective;
    this.time = time;
    this.day = day;
    this.notes = notes;
    this.activity = activity;
    this.user = user;
  }
}

export default PostActivitySaveDTO;
