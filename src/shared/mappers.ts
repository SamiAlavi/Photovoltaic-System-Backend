import { User } from "firebase/auth";
import { CustomUserRecord as CustomUserDetails } from "./interfaces";

export class Mapper {
    static mapUserRecord(source: User): CustomUserDetails {
        const destination: CustomUserDetails = {
            uid: source.uid,
            email: source.email ?? "",
        };
        return destination;
    }
}
