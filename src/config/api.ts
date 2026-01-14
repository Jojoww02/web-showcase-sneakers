import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type AxiosStatic,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useUserStore } from '@/store/userStore';

const uuidv4 = () => crypto.randomUUID();

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

const RAW_BASE = (import.meta as any).env?.AUTH_API_URL ?? (import.meta as any).env?.VITE_AUTH_API_URL;
const BASE_API = String(RAW_BASE ?? 'http://localhost:5295').replace(/\/$/, '');
const APP_NAME = 'WebShowcaseSneakers'; 
const APP_VERSION = '1.0.0';

const cancelTokenSource = axios.CancelToken.source();
let isRefreshing = false;
let failedQueue: {
  resolve: (token: TokenResponse | null) => void;
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: TokenResponse | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const _redirectHome = () => {
  useUserStore.getState().logout();
  window.location.assign('/');
};

const apiConfig: AxiosInstance = axios.create({
  baseURL: BASE_API,
  timeout: 310000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-app-source': APP_NAME,
    'x-app-version': APP_VERSION,
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    return searchParams.toString();
  },
});

declare module 'axios' {
  interface AxiosDefaults {
    interceptors?: {
      request: {
        onFulfilled?: Parameters<
          AxiosInstance['interceptors']['request']['use']
        >[0];
        onRejected?: Parameters<
          AxiosInstance['interceptors']['request']['use']
        >[1];
      };
      response: {
        onFulfilled?: Parameters<
          AxiosInstance['interceptors']['response']['use']
        >[0];
        onRejected?: Parameters<
          AxiosInstance['interceptors']['response']['use']
        >[1];
      };
    };
  }
}

// `https://github.com/axios/axios/issues/510`
// For create default interceptor for all instance or inherit instance,
// because axios is not supported yet
const _createAxios = (apiConfig as AxiosStatic).create.bind(axios);

(apiConfig as AxiosStatic).create = function create(conf) {
  const instance = _createAxios(conf);
  const defaultIcs = apiConfig.defaults.interceptors;

  const reqInterceptor = defaultIcs?.request ? defaultIcs.request : false;
  const resInterceptor = defaultIcs?.response ? defaultIcs.response : false;

  if (reqInterceptor) {
    instance.interceptors.request.use(
      reqInterceptor.onFulfilled,
      reqInterceptor.onRejected,
    );
  }
  if (resInterceptor) {
    instance.interceptors.response.use(
      resInterceptor.onFulfilled,
      resInterceptor.onRejected,
    );
  }
  return instance;
};

const requestFulfilled = (config: InternalAxiosRequestConfig) => {
  const token = useUserStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Access token not found');
  }

  config.headers['x-request-id'] = uuidv4();
  config.cancelToken = cancelTokenSource.token;

  return config;
};

const requestRejected = (error: AxiosError) => Promise.reject(error);

const responseFulfilled = (res: AxiosResponse) => res;

const responseRejected = async (err: AxiosError) => {
  const originalRequest = { ...err.config, _retry: false } as InternalAxiosRequestConfig & { _retry: boolean };
  
  // 400/500 Intermitent/PII Hiden
  // 401/403 Unauthorize
  const clientId = useUserStore.getState().user?.id;

  const isLoginPage = typeof window !== 'undefined' && window.location?.pathname === '/login';
  const isRefreshEndpoint = originalRequest.url === `${BASE_API}/refreshtoken/${clientId}`;
  if (
    import.meta.env.PROD &&
    err.response?.status === 400 &&
    isRefreshEndpoint &&
    !isLoginPage
  ) {
    _redirectHome();
  }

  const hasRefresh = !!useUserStore.getState().refreshToken;
  const isLoginRequest = !!originalRequest.url && originalRequest.url.includes('/api/Auth/login');
  const onLoginPage = typeof window !== 'undefined' && window.location?.pathname === '/login';
  if (
    (err.response?.status === 403 || err.response?.status === 401) &&
    !originalRequest._retry &&
    hasRefresh &&
    !isLoginRequest
  ) {
    if (isRefreshing) {
      try {
        const tokenData = await new Promise<TokenResponse | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        if (tokenData?.accessToken && originalRequest.headers) {
             originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`;
        }
        return await apiConfig(originalRequest);
      } catch (error: unknown) {
        return await Promise.reject(error);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const updateRefreshToken = async (): Promise<AxiosResponse<TokenResponse>> => {
      const refreshToken = useUserStore.getState().refreshToken;
      // Adjust endpoint as needed
      const response = await apiConfig.put(
        `${BASE_API}/refreshtoken/${clientId}`,
        {
          refreshToken: refreshToken,
        },
      );

      return response;
    };

    return new Promise((resolve, reject) => {
      updateRefreshToken()
        .then(({ data: response }) => {
          processQueue(null, response);
          useUserStore.getState().setToken(response.accessToken);
          if (response.refreshToken) {
            useUserStore.getState().setRefreshToken(response.refreshToken);
          }
          resolve(apiConfig(originalRequest));
        })
        .catch((error: AxiosError) => {
          processQueue(error, null);
          reject(err);
          if (!onLoginPage) {
            _redirectHome();
          } else {
            useUserStore.getState().logout();
          }
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
  return Promise.reject(err);
};

apiConfig.defaults.interceptors = {
  request: {
    onFulfilled: requestFulfilled,
    onRejected: requestRejected,
  },
  response: {
    onFulfilled: responseFulfilled,
    onRejected: responseRejected,
  },
};

// make sure the default exported instance also uses the interceptors
apiConfig.interceptors.request.use(requestFulfilled, requestRejected);
apiConfig.interceptors.response.use(responseFulfilled, responseRejected);

export default apiConfig;