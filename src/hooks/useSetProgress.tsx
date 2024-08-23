import { useEffect } from 'react';
import ActivityDoneDTO from '../dto/activities/ActivityDoneDTO.tsx';

export const useSetProgress = (activity: ActivityDoneDTO) => {
    useEffect(() => {
        if (activity.activitySave.activity.id <= 0) {
            createActivity();
        } else {
            updateActivity();
        }
    }, );

    const updateActivity = () => {
        console.log('Update activity:',activity);
    };
    const createActivity = () => {
        console.log('Add activity');
    };
    return [activity];
};
