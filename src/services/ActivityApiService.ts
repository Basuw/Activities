// @ts-ignore
import { DEV_API_URL } from '@env';
import dayjs from 'dayjs';

import ActivityProgressModel from '../models/Activities/ActivityProgressModel';
import { formatActivities } from './activities/formatActivities';

import ActivityDTO from '../dto/activities/ActivityDTO';
import ActivitySaveDTO from '../dto/activities/ActivitySaveDTO';
import ActivitySaveModel from '../models/Activities/ActivitySaveModel';
import { CreateActivityDTO } from '../dto/activities/CreateActivityDTO';
import { CreateActivitySaveDTO } from '../dto/activities/CreateActivitySaveDTO';
import { UpdateActivitySaveDTO } from '../dto/activities/UpdateActivitySaveDTO';
import { CreateActivityDoneDTO } from '../dto/activities/CreateActivityDoneDTO';
import { UpdateActivityDoneDTO } from '../dto/activities/UpdateActivityDoneDTO';

class ActivityApiService {
  private readonly baseUrl: string = DEV_API_URL;

  // ─── HTTP helper ───────────────────────────────────────────────────────────

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

  private formatDateTime(date: Date): string {
    const today = dayjs().format('YYYY-MM-DD');
    return date.toString() === today
      ? dayjs().format('YYYY-MM-DD HH:mm:ss')
      : dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }

  // ─── Activity ──────────────────────────────────────────────────────────────

  async fetchAllActivities(userId: number): Promise<ActivityDTO[]> {
    return this.request<ActivityDTO[]>(`${this.baseUrl}/activity/all/user/${userId}`);
  }

  async createActivity(dto: CreateActivityDTO): Promise<ActivityDTO> {
    return this.request<ActivityDTO>(`${this.baseUrl}/activity`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  // ─── ActivitySave ──────────────────────────────────────────────────────────

  async createActivitySave(dto: CreateActivitySaveDTO[]): Promise<void> {
    await this.request(`${this.baseUrl}/save`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async fetchSavesByGroupId(groupId: number): Promise<ActivitySaveModel[]> {
    const list = await this.request<any[]>(`${this.baseUrl}/save_by_group/${groupId}`);
    return list.map(item => new ActivitySaveModel(
      item.id,
      item.frequency,
      item.objective,
      item.time ? new Date(item.time) : new Date(),
      item.activity,
      item.day ?? '',
      item.notes ?? '',
      item.user,
    ));
  }

  async deleteActivitySave(id: number): Promise<void> {
    await this.request(`${this.baseUrl}/save/${id}`, { method: 'DELETE' });
  }

  async updateActivitySave(id: number, dto: UpdateActivitySaveDTO): Promise<void> {
    await this.request(`${this.baseUrl}/save/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  // ─── ActivityDone ──────────────────────────────────────────────────────────

  async fetchActivitiesDone(date: string, userId: number): Promise<ActivityProgressModel[]> {
    const data = await this.request<any[]>(
      `${this.baseUrl}/day_activities/user_id/${userId}?date=${date}`,
    );
    return formatActivities.setActivityDoneObjectListFromString(data);
  }

  /**
   * POST /achieve — crée un activityDone.
   * L'API renvoie une réponse partielle (sans activitySave complet) :
   * on ré-injecte l'activitySave connu du client dans la réponse.
   */
  async createActivityDone(
    dto: CreateActivityDoneDTO,
    activitySave: ActivitySaveDTO,
  ): Promise<ActivityProgressModel> {
    const data = await this.request<ActivityProgressModel>(
      `${this.baseUrl}/achieve?doneOn=${this.formatDateTime(dto.doneOn)}`,
      {
        method: 'POST',
        body: JSON.stringify({
          achievement: dto.achievement,
          mark: dto.mark,
          notes: dto.notes,
          activitySave: dto.activitySave,
          status: dto.status,
          duration: dto.duration,
        }),
      },
    );
    data.activityDone.activitySave = activitySave;
    return data;
  }

  /**
   * PATCH /achieve/:id — met à jour un activityDone existant.
   * L'API accepte les champs en query params.
   */
  async updateActivityDone(
    id: number,
    dto: UpdateActivityDoneDTO,
    activitySave: ActivitySaveDTO,
  ): Promise<ActivityProgressModel> {
    const params = new URLSearchParams({
      achievement: String(dto.achievement),
      status: dto.status,
      mark: String(dto.mark),
      notes: dto.notes,
      doneOn: this.formatDateTime(dto.doneOn),
    });
    if (dto.duration != null) {
      params.set('duration', String(dto.duration));
    }
    const data = await this.request<ActivityProgressModel>(
      `${this.baseUrl}/achieve/${id}?${params}`,
      { method: 'PATCH' },
    );
    data.activityDone.activitySave = activitySave;
    return data;
  }
}

export const activityApiService = new ActivityApiService();
