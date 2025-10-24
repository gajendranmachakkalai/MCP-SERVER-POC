import axios, { AxiosError } from 'axios';

axios.defaults.baseURL = 'https://azemployeewebapi-dbehd3fqbqhsc7cq.centralindia-01.azurewebsites.net/api/';

axios.interceptors.response.use(null,async (error: AxiosError) => {
    return Promise.reject(error);
});

export default{
    get: axios.get,
    post: axios.post,   
    put: axios.put,
    delete: axios.delete
}

