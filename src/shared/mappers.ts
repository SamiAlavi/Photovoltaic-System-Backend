import { UserImp, CustomUserRecord } from "./interfaces";

export class Mapper {
    static mapUserRecord(source: UserImp): CustomUserRecord {
        const destination: CustomUserRecord = {
            uid: source.uid,
            email: source.email ?? "",
            accessToken: source.accessToken ?? "",
        };
        return destination;
    }
}
