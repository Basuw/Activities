import React, {useEffect, useRef} from 'react';
import ActivityDoneDTO from '../dto/activities/ActivityDoneDTO.tsx';
import {DEV_API_URL} from '@env';

export const useSetProgress = (activity: ActivityDoneDTO, setGetActivities: React.Dispatch<React.SetStateAction<string>>) => {
    const timeoutRef = useRef<null | NodeJS.Timeout>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (activity.activitySave.activity.id <= 0) {
                createActivity();
            } else {
                updateActivity();
            }        }, 300); // Adjust the delay as needed
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, );

    const updateActivity = async () => {
        try {
            const url = `${DEV_API_URL}/achieve/${activity.activitySave.userId}
            ?achievement=${activity.achievement}
            &status=${activity.status}
            &mark=${activity.mark}
            &notes=${activity.notes}
            &duration=${activity.duration}`;
            const url2='http://localhost:8080/activities/achieve/11?achievement=15&status=NOT_STARTED&mark=2&notes=Ceci%20est%20ma%20notte&duration=1%3A01%3A11'
            const response = await fetch(url2, {method: 'PATCH'});
            const data = await response.json();
            console.log('Update activity:',activity);

            setGetActivities(new Date().toISOString().split('T')[1].split('.')[0]);

        }catch (error) {
            console.error('Error:',error);
        }
    };
    const createActivity = () => {
        console.log('Add activity');
    };
    return [activity];
};
