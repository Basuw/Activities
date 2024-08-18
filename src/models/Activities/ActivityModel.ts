import UserModel from '../UserModel';

class ActivityModel {
  id: number;
  name: string;
  icon: string;
  unity: string;
  description: string;
  category: string;
  user: UserModel;

  constructor(
    id: number,
    name: string,
    icon: string,
    unity: string,
    description: string,
    category: string,
    user: UserModel
  ) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.unity = unity;
    this.description = description;
    this.category = category;
    this.user = user;
  }
}

export default ActivityModel;
