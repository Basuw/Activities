class UserModel {
  id: number;
  username: string;
  password: string;
  mail: string;
  role: string;
  createdOn: Date;
  birthDate: Date;
  weight: number;
  height: number;
  fat: number;
  targetWeight: number;

  constructor(
    id: number,
    username: string,
    password: string,
    mail: string,
    role: string,
    createdOn: Date,
    birthDate: Date,
    weight: number,
    height: number,
    fat: number,
    targetWeight: number
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.mail = mail;
    this.role = role;
    this.createdOn = createdOn;
    this.birthDate = birthDate;
    this.weight = weight;
    this.height = height;
    this.fat = fat;
    this.targetWeight = targetWeight;
  }
}

export default UserModel;
