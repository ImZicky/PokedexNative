import { Pokemon } from "pokenode-ts";

export type UserLoginCriteria = {
  password: string | undefined;
  email: string | undefined;
};

export type UserCriteria = {
  password: string | undefined;
  email: string | undefined;
};

export type User = {
  id: string | undefined;
  email: string | undefined;
  name: string | undefined;
  pokemons: Pokemon[] | undefined;
};

export type UserCredentials = {
  user: User | undefined;
  token: string | undefined;
  isLogged: boolean;
};
