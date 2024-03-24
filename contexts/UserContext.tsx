import React, { createContext, useState } from "react";
import { UserCredentials } from "../service/api/types/User";

const UserContext = createContext<UserCredentials | undefined>({
  user: undefined,
  token: undefined,
  isLogged: false,
});

export { UserContext };


