import axios from "axios";
// import { getToken } from './auth';

export const apiPokemon = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/', 
  // baseURL: process.env.POKEMON_API_BASEURL, 
});

export const apiPokedex = axios.create({
  baseURL: process.env.POKEDEX_APP_BACKEND_API, 
});

const handlerRequest = (config) => {
  //   const token = getToken();
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }

  return config;
};

const handlerError = (error) => {
  if (error.response.status === 401) {
    console.log(`HTTP 401, ${error}`);
  } else if (error.response.status === 500) {
    console.log(`HTTP 500, ${error}`);
  } else {
    console.log(`HTTP ???, ${error}`);
  }

  return Promise.reject(error);
};

apiPokemon.interceptors.request.use(
  async (config) => handlerRequest(config),
  async (error) => handlerError(error)
);

apiPokemon.interceptors.response.use(
  async (response) => response,
  async (error) => handlerError(error)
);

apiPokedex.interceptors.request.use(
  async (config) => handlerRequest(config),
  async (error) => handlerError(error)
);

apiPokedex.interceptors.response.use(
  async (response) => response,
  async (error) => handlerError(error)
);
