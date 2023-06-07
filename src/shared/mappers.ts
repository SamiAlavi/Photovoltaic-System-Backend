import { User } from "firebase/auth";
import { ICustomUserRecord } from "./interfaces";

export class Mapper {
    static mapUserRecord(source: User): ICustomUserRecord {
        const destination: ICustomUserRecord = {
            uid: source.uid,
            email: source.email ?? "",
        };
        return destination;
    }
}
