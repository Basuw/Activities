import { useEffect } from "react";
import ActivityModel from "../models/Activities/ActivityModel.ts";
import ActivityProgressModel from "../models/Activities/ActivityProgressModel.ts";

export const useSetProgress = (activity: ActivityModel, setActivities: React.Dispatch<React.SetStateAction<ActivityProgressModel[]>>) => {
    useEffect(() => {
        if (activity.id <= 0) {
            createActivity();
        } else {
            updateActivity();
        }
        setActivities((prevActivities) =>
            prevActivities.map((act) =>
                act === activity ? { ...act, activityDone: { ...act.activityDone, achievement: act.activityDone.activitySave.objective } } : act
            )
        );
    }, [activity]);

    const updateActivity = () => {
        console.log('Update activity');
    };
    const createActivity = () => {
        console.log('Add activity');
    };
};
