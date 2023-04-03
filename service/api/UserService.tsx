import { UserCredentials, UserCriteria } from "./types/User";

export default function UseUserService() {
  return {
    login: async (user: UserCriteria) => {
      const response: UserCredentials = {
        isLogged: true,
        token: "Bearer_TOKEN-AQUI",
        user: {
          id: "id_hashed_aqui",
          pokemons: undefined,
          email: user.email,
          name: "Ash Ketchum",
        },
      };
      return response;
    },
  };
}
