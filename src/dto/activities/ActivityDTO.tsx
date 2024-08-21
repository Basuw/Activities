class ActivityDTO {
    id: number;
    name: string;
    description: string;
    unity: string;
    icon: string;
    userId: number;

    constructor(
        id: number,
        name: string,
        description: string,
        unity: string,
        icon: string,
        userId: number
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.unity = unity;
        this.icon = icon;
        this.userId = userId;
    }
}

export default ActivityDTO;
