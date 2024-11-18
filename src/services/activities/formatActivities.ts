import ActivityProgressModel from '../../models/Activities/ActivityProgressModel';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO';
import ActivitySaveDTO from '../../dto/activities/ActivitySaveDTO';
import ActivityDTO from '../../dto/activities/ActivityDTO';

const idRef = { current: -1 };

export const formatActivities = {
    setActivityDoneObjectListFromString: (data: string[]) => {
        const dataActivitiesProgress: ActivityProgressModel[] = data.map((item: any) => new ActivityProgressModel(
            new ActivityDoneDTO(
                item.activityDone.id,
                item.activityDone.achievement,
                item.activityDone.doneOn,
                new ActivitySaveDTO(
                    item.activityDone.activitySave.id,
                    item.activityDone.activitySave.frequency,
                    item.activityDone.activitySave.objective,
                    new ActivityDTO(
                        item.activityDone.activitySave.activity.id,
                        item.activityDone.activitySave.activity.name,
                        item.activityDone.activitySave.activity.description,
                        item.activityDone.activitySave.activity.unity,
                        item.activityDone.activitySave.activity.icon,
                        item.activityDone.activitySave.activity.category,
                        item.activityDone.activitySave.activity.userId,
                    ),
                    item.activityDone.activitySave.userId),
                item.activityDone.mark,
                item.activityDone.notes,
                item.activityDone.status,
                item.activityDone.duration,
            ),
            item.weekProgress,
            item.weekObjective,
        ));
        for (let i = 0; i < dataActivitiesProgress.length; i++) {
            if (dataActivitiesProgress[i].activityDone.id === 0) {
                dataActivitiesProgress[i].activityDone.id = idRef.current;
                idRef.current--;
            }
        }
        return dataActivitiesProgress;
    }
};
