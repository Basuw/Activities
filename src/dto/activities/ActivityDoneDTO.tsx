import ActivitySaveDTO from "./ActivitySaveDTO.tsx";

class ActivityDoneDTO {
    id: number;
    achievement: number;
    doneOn: Date;
    activitySave: ActivitySaveDTO;
    mark: number;
    notes: string;
    status: string;
    duration: Date;

    constructor(
        id: number,
        achievement: number,
        doneOn: Date,
        activitySave: ActivitySaveDTO,
        mark: number,
        notes: string,
        status: string,
        duration: Date
    ) {
        this.id = id;
        this.achievement = achievement;
        this.doneOn = doneOn;
        this.activitySave = activitySave;
        this.mark = mark;
        this.notes = notes;
        this.status = status;
        this.duration = duration;
    }
}

export default ActivityDoneDTO;
