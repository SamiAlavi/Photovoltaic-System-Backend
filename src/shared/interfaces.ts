import { User } from "firebase/auth";

interface UserImp extends User {
    accessToken?: string,
}

interface CustomUserRecord {
    uid: string,
    email: string,
    accessToken: string,
}

export {
    UserImp,
    CustomUserRecord,
};
