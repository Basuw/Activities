// src/services/activities/callAPIService.ts
import { formatActivities } from './formatActivities.ts';
// @ts-ignore
import { DEV_API_URL } from '@env';
import ActivityProgressModel from '../../models/Activities/ActivityProgressModel.ts';
import ActivityDoneDTO from '../../dto/activities/ActivityDoneDTO.tsx';
import StatusEnum from '../../models/Activities/StatusEnum.ts';
import dayjs from 'dayjs';

export class callApiService {
    static async fetchActivitiesDone(selectedDay: string, userId: number): Promise<ActivityProgressModel[]> {
        try {
            console.log('selectedDay fetch', selectedDay);
            const url = `${DEV_API_URL}/day_activities/user_id/${userId}?date=${selectedDay}`;
            const response = await fetch(url);
            if (response.status === 200) {
                const responseData = await response.json();
                return formatActivities.setActivityDoneObjectListFromString(responseData);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            throw error;
        }
    }

    static async postActivityDone(activityDoneObject: ActivityDoneDTO): Promise<ActivityProgressModel> {
        const doneOne = activityDoneObject.doneOn.toString() === dayjs().format('YYYY-MM-DD') ? dayjs().format('YYYY-MM-DD HH:mm:ss') : dayjs(activityDoneObject.doneOn).format('YYYY-MM-DD HH:mm:ss');
        const url = `${DEV_API_URL}/achieve?doneOn=${doneOne}`;
        const activitySave = activityDoneObject.activitySave;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    achievement: activityDoneObject.achievement,
                    mark: activityDoneObject.mark,
                    notes: activityDoneObject.notes,
                    activitySave: {
                        id: activityDoneObject.activitySave.id,
                    },
                    status: StatusEnum.COMPLETED,
                    duration: activityDoneObject.duration,
                }),
            });

            if (response.status === 200) {
                const responseData:ActivityProgressModel = await response.json();
                responseData.activityDone.activitySave = activitySave;
                return responseData;
            } else {
                throw new Error('Failed to Post activity');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async patchActivityDone(activityDoneObject: ActivityDoneDTO): Promise<ActivityProgressModel> {
        const doneOne = activityDoneObject.doneOn.toString() === dayjs().format('YYYY-MM-DD') ? dayjs().format('YYYY-MM-DD HH:mm:ss') : dayjs(activityDoneObject.doneOn).format('YYYY-MM-DD HH:mm:ss');

        const url = activityDoneObject.duration == null
            ? `${DEV_API_URL}/achieve/${activityDoneObject.id}?achievement=${activityDoneObject.achievement}&status=${activityDoneObject.status}&mark=${activityDoneObject.mark}&notes=${activityDoneObject.notes}&doneOn=${doneOne}`
            : `${DEV_API_URL}/achieve/${activityDoneObject.id}?achievement=${activityDoneObject.achievement}&status=${activityDoneObject.status}&mark=${activityDoneObject.mark}&notes=${activityDoneObject.notes}&doneOn=${doneOne}&duration=${activityDoneObject.duration}`;

        const activitySave = activityDoneObject.activitySave;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const responseData:ActivityProgressModel = await response.json();
                responseData.activityDone.activitySave = activitySave;
                return responseData;
            } else {
                throw new Error('Failed to patch activity');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
