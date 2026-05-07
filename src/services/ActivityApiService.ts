// @ts-ignore
import { DEV_API_URL } from '@env';
import ActivityProgressModel from '../models/Activities/ActivityProgressModel';
import ActivityDoneDTO from '../dto/activities/ActivityDoneDTO';
import ActivityDTO from '../dto/activities/ActivityDTO';
import { formatActivities } from './activities/formatActivities';
import StatusEnum from '../models/Activities/StatusEnum';
import DayEnum from '../models/Activities/DayEnum';
import dayjs from 'dayjs';

export interface CreateActivityPayload {
  name: string;
  description: string;
  unity: string;
  icon: string;
  category: string;
  userId: number;
}

export interface CreateActivitySavePayload {
  frequency: number;
  objective: number;
  notes: string;
  activity: { id: number };
  user: { id: number };
  day?: DayEnum;
}

class ActivityApiService {
  private readonly baseUrl: string = DEV_API_URL;

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${url}`);
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as unknown as T;
    }
    return response.json() as Promise<T>;
  }

  async fetchActivitiesDone(date: string, userId: number): Promise<ActivityProgressModel[]> {
    const data = await this.request<any[]>(
      `${this.baseUrl}/day_activities/user_id/${userId}?date=${date}`,
    );
    return formatActivities.setActivityDoneObjectListFromString(data);
  }

  async fetchAllActivities(userId: number): Promise<ActivityDTO[]> {
    return this.request<ActivityDTO[]>(`${this.baseUrl}/activity/all/user/${userId}`);
  }

  async createActivity(payload: CreateActivityPayload): Promise<ActivityDTO> {
    return this.request<ActivityDTO>(`${this.baseUrl}/activity`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createActivitySave(payload: CreateActivitySavePayload): Promise<void> {
    await this.request(`${this.baseUrl}/save`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async postActivityDone(activityDone: ActivityDoneDTO): Promise<ActivityProgressModel> {
    const doneOn = this.formatDateTime(activityDone.doneOn);
    const activitySave = activityDone.activitySave;
    const data = await this.request<ActivityProgressModel>(
      `${this.baseUrl}/achieve?doneOn=${doneOn}`,
      {
        method: 'POST',
        body: JSON.stringify({
          achievement: activityDone.achievement,
          mark: activityDone.mark,
          notes: activityDone.notes,
          activitySave: { id: activityDone.activitySave.id },
          status: StatusEnum.COMPLETED,
          duration: activityDone.duration,
        }),
      },
    );
    data.activityDone.activitySave = activitySave;
    return data;
  }

  async patchActivityDone(activityDone: ActivityDoneDTO): Promise<ActivityProgressModel> {
    const doneOn = this.formatDateTime(activityDone.doneOn);
    const params = new URLSearchParams({
      achievement: String(activityDone.achievement),
      status: activityDone.status,
      mark: String(activityDone.mark),
      notes: activityDone.notes,
      doneOn,
    });
    if (activityDone.duration != null) {
      params.set('duration', String(activityDone.duration));
    }
    const activitySave = activityDone.activitySave;
    const data = await this.request<ActivityProgressModel>(
      `${this.baseUrl}/achieve/${activityDone.id}?${params}`,
      { method: 'PATCH' },
    );
    data.activityDone.activitySave = activitySave;
    return data;
  }

  private formatDateTime(date: Date): string {
    const today = dayjs().format('YYYY-MM-DD');
    return date.toString() === today
      ? dayjs().format('YYYY-MM-DD HH:mm:ss')
      : dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }
}

export const activityApiService = new ActivityApiService();
