import {useEffect, useState, useRef} from 'react';
import {DEV_API_URL} from '@env';
import ActivityDoneDTO from "../dto/activities/ActivityDoneDTO.tsx";

export const useGetActivities = (selectedDay: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [activities, setActivities] = useState<ActivityDoneDTO[]>([]);
    const timeoutRef = useRef<null | NodeJS.Timeout>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            fetchActivitiesDone();
        }, 300); // Adjust the delay as needed

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [selectedDay]);

    const fetchActivitiesDone = async () => {
        setLoading(true);
        try {
            const url = `${DEV_API_URL}/day_activities/user_id/4?date=${selectedDay}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log('data', data);
            console.log('data[0].achievement', data[0].achievement);
            const dataActivities: ActivityDoneDTO[] = data.map((item: any) => new ActivityDoneDTO(
                item.id,
                item.achievement,
                item.doneOn,
                item.activitySaveId,
                item.mark,
                item.notes,
                item.status,
                item.duration,
            ));
            setActivities(dataActivities);
        } catch (e) {
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    return [activities, loading, error];
};
