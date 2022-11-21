
import { handleResponse, handleErrors } from "../utils/api-response";

export const getPosts = () => {
  const requestOptions = { method: 'GET', };
  let url = 'https://jsonplaceholder.typicode.com/posts?_limit=10';
  return fetch(url, requestOptions).then(handleResponse).catch(handleErrors);
}

export const getPostById = (id: number) => {
  const requestOptions = { method: 'GET', };
  let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
  return fetch(url, requestOptions).then(handleResponse).catch(handleErrors);
}

export const LoginAPI = (body: any) => {
  const requestOptions = { method: 'POST', body: JSON.stringify(body) };
  let url = `${process.env.REACT_APP_API_URL}/auth/login`;
  return fetch(url, requestOptions).then(handleResponse).catch(handleErrors);
}

export const SignupAPI = (body: any) => {
  const requestOptions = { method: 'POST', body: JSON.stringify(body) };
  let url = `${process.env.REACT_APP_API_URL}/auth/sign-up`;
  return fetch(url, requestOptions).then(handleResponse).catch(handleErrors);
}

