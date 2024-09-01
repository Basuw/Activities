import UserModel from '../models/UserModel.ts';
import ActivitySaveModel from '../models/Activities/ActivitySaveModel.ts';
import ActivityModel from '../models/Activities/ActivityModel.ts';
import ActivityDoneModel from '../models/Activities/ActivityDoneModel.ts';
import StatusEnum from "../models/Activities/StatusEnum.ts";
import ActivityProgressModel from "../models/Activities/ActivityProgressModel.ts";

class StubService {
    user:UserModel;
    activities:ActivityModel[];
    activitiesSaved:ActivitySaveModel[];
    activitiesDone:ActivityDoneModel[];
    activitiesProgress:ActivityProgressModel[];
    constructor() {
        this.user = new UserModel(4,
            'Bastien',
            '1234',
            'jonh.doe@gmail.com',
            'admin',
            new Date('2021-09-01T00:00:00.000Z'),
            new Date('2021-09-01T00:00:00.000Z'),
            73.4,
            1.75,
            1,
            1);
        this.activities = [
            new ActivityModel(1,
                'Running',
                'run-fast',
                'km',
                'Morning run',
                'Fitness',
                this.user),
            new ActivityModel(2,
                'Swimming',
                'swim',
                'laps',
                'Evening swim',
                'Fitness',
                this.user),
            new ActivityModel(3,
                'Reading',
                'book',
                'page',
                'Evening read',
                'Leisure',
                this.user),
            ];
        this.activitiesSaved = [
            new ActivitySaveModel(1, 3,10, new Date('2021-09-01T00:00:00.000Z'),this.activities[0], this.user),
            new ActivitySaveModel(2, 1, 1.5, new Date('2021-09-01T00:00:00.000Z'),this.activities[1], this.user),
        ];
        this.activitiesDone = [
            new ActivityDoneModel(1,8, new Date('2021-09-01T00:00:00.000Z'), this.activitiesSaved[0], 5, 'Good run', StatusEnum.COMPLETED, new Date('2021-09-01T00:00:00.000Z')),
            new ActivityDoneModel(2, 1.5, new Date('2021-09-01T00:00:00.000Z'), this.activitiesSaved[1], 4, 'Good swim', StatusEnum.COMPLETED, new Date('2021-09-01T00:00:00.000Z')),
        ];
       this.activitiesProgress = [
            new ActivityProgressModel(this.activitiesDone[0], 80, 2),
            new ActivityProgressModel(this.activitiesDone[1], 100, 1),
        ];
    }
}

export default StubService;
