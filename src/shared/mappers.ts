import { UserImp, CustomUserRecord } from "./interfaces";

export class Mapper {
    static mapUserRecord(source: UserImp): CustomUserRecord {
        const destination: CustomUserRecord = {
            uid: source.uid,
            email: source.email ?? "",
        };
        return destination;
    }
}
