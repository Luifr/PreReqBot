import { db } from "../db"
import { IUser } from "../models/user";

const usersCollection = db.collection('users');

export class UserController {
  
  static get = async (id: string) => {
    const userData = await usersCollection.doc(id).get();
    return userData;
  }

  static set = (id: string | number, user: Partial<IUser>) => {
    usersCollection.doc(String(id)).set(
      user, 
      {merge: true}
    );
  }

}
