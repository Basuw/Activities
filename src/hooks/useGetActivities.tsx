import { useEffect, useState, useRef } from 'react';
import { DEV_API_URL } from '@env';
import ActivityDoneDTO from '../dto/activities/ActivityDoneDTO.tsx';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel.ts';
import ActivitySaveDTO from '../dto/activities/ActivitySaveDTO.tsx';
import ActivityDTO from '../dto/activities/ActivityDTO.tsx';
import UserModel from '../models/UserModel.ts';

export const useGetActivities = (selectedDay: string, getActivities: string, setActivities: React.Dispatch<React.SetStateAction<ActivityProgressModel[]>>, user: UserModel) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const timeoutRef = useRef<null | NodeJS.Timeout>(null);
    const idRef = useRef(-1);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            fetchActivitiesDone();
        }, 100); // Adjust the delay as needed

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [selectedDay, getActivities]);

    const fetchActivitiesDone = async () => {
        setLoading(true);
        try {
            const url = `${DEV_API_URL}/day_activities/user_id/${user.id}?date=${selectedDay}`;
            const response = await fetch(url);
            const data = await response.json();
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
            setActivities(dataActivitiesProgress);
        } catch (e) {
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    return [loading, error];
};
