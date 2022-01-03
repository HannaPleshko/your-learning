import bcrypt from 'bcrypt';
import { ExceptionType } from '../exception/exception';
import { ErrorHandler } from '../helpers/error';
import { createToken } from '../helpers/jwt';
import { createUser, getUser, hardDelUser, delUser } from './auth.repository';

const saltround = 10;

export const regUser = async (email: string, name: string, pwd: string): Promise<iAuth> => {
  const user = await getUser(email, name).catch((err) => {
    throw err;
  });

  if (user) throw new ErrorHandler(500, ExceptionType.USER_EXISTS);

  const hashPwd = await bcrypt.hash(pwd, saltround);
  const newUser = await createUser(email, name, hashPwd).catch((err) => {
    throw err;
  });

  if (!newUser) throw new ErrorHandler(404, ExceptionType.NOT_FOUND);
  return newUser;
};

export const authUser = async (email: string, name: string, pwd: string): Promise<iTokenData> => {
  const user = await getUser(email, name).catch((err) => {
    throw err;
  });

  if (!user) throw new ErrorHandler(404, ExceptionType.NOT_FOUND);
  if (user.role === 1 || user.role === 2) { //1-active 2-admin 3-inactive
    const hashPwd = user.password;
    if (!(await bcrypt.compare(pwd, hashPwd))) throw new ErrorHandler(500, ExceptionType.WRONG_PASSWORD);
    return createToken(user);
  } else throw new ErrorHandler(500, ExceptionType.USER_INACTIVE);
};

export const deleteUser = async (email: string): Promise<iAuth> => { // delete by mail
  let user;
  // DEV - UNITTEST
  // PROD - Changes the user's status. 0 - active, 1 - remote
  if (process.env.NODE_ENV === 'DEV') {
    user = await hardDelUser(email).catch((err) => {
      throw err;
    });
  } else {
    user = await delUser(email).catch((err) => {
      throw err;
    });
  }

  if (!user) throw new ErrorHandler(404, ExceptionType.NOT_FOUND);
  return user;
};

