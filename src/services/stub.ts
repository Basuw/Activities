import UserModel from '../models/UserModel';
import ActivitySaveModel from '../models/Activities/ActivitySaveModel';
import ActivityModel from '../models/Activities/ActivityModel';
import ActivityDoneModel from '../models/Activities/ActivityDoneModel';
import StatusEnum from '../models/Activities/StatusEnum';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel';

class StubService {
  user: UserModel;
  activities: ActivityModel[];
  activitiesSaved: ActivitySaveModel[];
  activitiesDone: ActivityDoneModel[];
  activitiesProgress: ActivityProgressModel[];

  constructor() {
    this.user = new UserModel(
      1,
      'Bastien',
      '1234',
      'bastien@gmail.com',
      'admin',
      new Date('2021-01-01T00:00:00.000Z'),
      new Date('1995-06-15T00:00:00.000Z'),
      73.4,
      1.75,
      1,
      1,
    );

    this.activities = [
      new ActivityModel(1, 'Running', 'run-fast', 'km', 'Outdoor or treadmill running', 'Fitness', this.user),
      new ActivityModel(2, 'Swimming', 'swim', 'laps', 'Pool or open water swimming', 'Fitness', this.user),
      new ActivityModel(3, 'Cycling', 'bike', 'km', 'Road or mountain biking', 'Fitness', this.user),
      new ActivityModel(4, 'Weight Training', 'weight-lifter', 'sets', 'Strength training', 'Fitness', this.user),
      new ActivityModel(5, 'Yoga', 'yoga', 'min', 'Yoga and flexibility', 'Fitness', this.user),
      new ActivityModel(6, 'Walking', 'walk', 'steps', 'Daily walking', 'Fitness', this.user),
      new ActivityModel(7, 'Hiking', 'hiking', 'km', 'Trail hiking in nature', 'Fitness', this.user),
      new ActivityModel(8, 'Sleep', 'sleep', 'hours', 'Quality sleep tracking', 'Health', this.user),
      new ActivityModel(9, 'Drink Water', 'cup-water', 'glasses', 'Daily hydration', 'Health', this.user),
      new ActivityModel(10, 'Meditation', 'peace', 'min', 'Mindfulness meditation', 'Mindfulness', this.user),
      new ActivityModel(11, 'Journaling', 'notebook-edit', 'entries', 'Daily journal', 'Mindfulness', this.user),
      new ActivityModel(12, 'Reading', 'book-open-variant', 'pages', 'Books and articles', 'Learning', this.user),
      new ActivityModel(13, 'Coding', 'code-braces', 'min', 'Programming practice', 'Learning', this.user),
      new ActivityModel(14, 'Language Practice', 'translate', 'min', 'Foreign language learning', 'Learning', this.user),
      new ActivityModel(15, 'Drawing', 'pencil-box', 'min', 'Sketching or digital art', 'Creative', this.user),
      new ActivityModel(16, 'Music Practice', 'music', 'min', 'Instrument practice', 'Creative', this.user),
    ];

    this.activitiesSaved = [
      new ActivitySaveModel(1, 3, 5, new Date('2024-01-01'), this.activities[0], this.user),
      new ActivitySaveModel(2, 5, 30, new Date('2024-01-01'), this.activities[11], this.user),
      new ActivitySaveModel(3, 7, 10, new Date('2024-01-01'), this.activities[9], this.user),
    ];

    this.activitiesDone = [
      new ActivityDoneModel(1, 4, new Date(), this.activitiesSaved[0], 4, 'Good run!', StatusEnum.COMPLETED, null as any),
      new ActivityDoneModel(2, 25, new Date(), this.activitiesSaved[1], 5, 'Great chapter', StatusEnum.COMPLETED, null as any),
    ];

    this.activitiesProgress = [
      new ActivityProgressModel(this.activitiesDone[0] as any, 2, 3),
      new ActivityProgressModel(this.activitiesDone[1] as any, 4, 5),
    ];
  }
}

export default StubService;
