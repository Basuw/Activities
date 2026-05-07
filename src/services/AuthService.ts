import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import { DEV_API_URL } from '@env';
import UserModel from '../models/UserModel';
import { sha256 } from '../utils/crypto';

const SESSION_KEY = '@activities_session';

interface StoredSession {
  user: {
    id: number;
    username: string;
    mail: string;
    role: string;
    weight: number;
    height: number;
    fat: number;
    targetWeight: number;
  };
}

class AuthService {
  private readonly baseUrl: string = DEV_API_URL;

  /** Send login request to backend with hashed password. Returns UserModel on success. */
  async login(mail: string, plainPassword: string): Promise<UserModel> {
    const passwordHash = sha256(plainPassword);

    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mail, password: passwordHash }),
    });

    if (response.status === 401) {
      throw new Error('Invalid email or password.');
    }
    if (!response.ok) {
      throw new Error('Server error. Please try again later.');
    }

    const data = await response.json();
    const user = this.mapResponseToUserModel(data);
    await this.saveSession(user);
    return user;
  }

  /** Register a new user, save session and return UserModel. */
  async register(username: string, mail: string, plainPassword: string): Promise<UserModel> {
    const passwordHash = sha256(plainPassword);

    const response = await fetch(`${this.baseUrl}/user`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        mail,
        password: passwordHash,
        role: 'user',
        createdOn: new Date().toISOString().split('T')[0],
        birthDate: new Date().toISOString().split('T')[0],
        weight: 0,
        height: 0,
        fat: 0,
        targetWeight: 0,
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed. This email may already be in use.');
    }

    const data = await response.json();
    const user = this.mapResponseToUserModel(data);
    await this.saveSession(user);
    return user;
  }

  /** Clear the local session (logout). */
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  /** Restore session from local storage. Returns null if no session exists. */
  async restoreSession(): Promise<UserModel | null> {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session: StoredSession = JSON.parse(raw);
      return this.mapSessionToUserModel(session);
    } catch {
      return null;
    }
  }

  private async saveSession(user: UserModel): Promise<void> {
    const session: StoredSession = {
      user: {
        id: user.id,
        username: user.username,
        mail: user.mail,
        role: user.role,
        weight: user.weight,
        height: user.height,
        fat: user.fat,
        targetWeight: user.targetWeight,
      },
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private mapResponseToUserModel(data: any): UserModel {
    return new UserModel(
      data.id,
      data.username,
      '',           // never store plain password
      data.mail,
      data.role,
      new Date(data.createdOn),
      new Date(data.birthDate),
      data.weight ?? 0,
      data.height ?? 0,
      data.fat ?? 0,
      data.targetWeight ?? 0,
    );
  }

  private mapSessionToUserModel(session: StoredSession): UserModel {
    return new UserModel(
      session.user.id,
      session.user.username,
      '',
      session.user.mail,
      session.user.role,
      new Date(),
      new Date(),
      session.user.weight,
      session.user.height,
      session.user.fat,
      session.user.targetWeight,
    );
  }
}

export const authService = new AuthService();
