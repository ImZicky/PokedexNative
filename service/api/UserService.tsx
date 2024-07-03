import { UserCredentials, UserCriteria, UserLoginCriteria } from "./types/User";

export default function UseUserService() {
  return {
    //TODO: PRECISA FAZER LIGAR A UMA API DE FATO
    login: async (user: UserLoginCriteria) => {
      const criteria: UserCredentials = {
        isLogged: true,
        token: "Bearer_TOKEN-AQUI",
        user: {
          id: "id_hashed_aqui",
          pokemons: undefined,
          email: user.email,
          name: "Ash Ketchum",
        },
      };
      return criteria;
    },
    createAccount: async (user: UserCriteria) => {
      const criteria: UserCriteria = {
        email: user.email,
        name: user.name,
        password: user.password,
        image: user.image
      };
      return criteria;
    },
  };
}
