// src/services/activities/callAPIService.ts
import { formatActivities } from './formatActivities.ts';
import { DEV_API_URL } from '@env';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel.ts';

export class callApiService {
    static fetchActivitiesDone(selectedDay: string, userId: number): Promise<ActivityProgressModel[]> {
        return new Promise((resolve, reject) => {
            let data;
            try {
                console.log('selectedDay fetch', selectedDay);
                const url = `${DEV_API_URL}/day_activities/user_id/${userId}?date=${selectedDay}`;
                fetch(url).then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                })
                .then((responseData) => {
                    data = responseData;
                    resolve(formatActivities.setActivityDoneObjectListFromString(data));
                })
                .catch((error) => {
                    reject(error);
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}
