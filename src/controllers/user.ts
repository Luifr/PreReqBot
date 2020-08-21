import { db } from "../db"
import { IUser } from "../models/user";

const usersCollection = db.collection('users');

export class UserController {

  static get = async (id: string | number): Promise<IUser | undefined> => {
    const userData = await usersCollection.doc(String(id)).get();
    return userData.data() as IUser | undefined;
  }

  static set = (id: string | number, user: Partial<IUser>) => {
    usersCollection.doc(String(id)).set(
      user,
      {merge: true}
    );
  }

}
