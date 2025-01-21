import {isObject, isString} from 'lodash';
import BaseSetting from '../config/setting';
import {store} from '../redux/store/configureStore';
import {sendErrorReport} from './commonFunction';
import Toast from 'react-native-toast-message';

export function getApiData(endpoint, method, data, headers) {
  const authState = store?.getState() || {};
  const {token} = authState?.auth?.accessToken || '';
  const {uuid} = authState?.auth || '';
  const authHeaders = {
    'Content-Type': 'application/json',
    authorization: token ? `Bearer ${token}` : '',
  };

  return new Promise((resolve, reject) => {
    let query = '';
    let qs = '';
    for (const key in data) {
      query += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
    }
    const params = {};
    params.method = method.toLowerCase() === 'get' ? 'get' : 'post';
    if (headers) {
      params.headers = headers;
    } else {
      params.headers = authHeaders;
    }
    // console.log(params.headers);
    if (params.method === 'post') {
      if (
        params.headers &&
        params.headers['Content-Type'] &&
        params.headers['Content-Type'] === 'application/json'
      ) {
        params.body = JSON.stringify(data);
      } else {
        params.body = query;
      }
    } else {
      qs = `?${query}`;
    }

    // console.log('params=--', params, endpoint);

    if (
      params.method === 'post' &&
      params.headers &&
      params.headers['Content-Type'] &&
      params.headers['Content-Type'] === 'application/json'
    ) {
      // console.log(JSON.stringify(data));
    } else {
      let str = '';
      if (data && Object.keys(data).length > 0) {
        Object.keys(data).map(dk => {
          str += `${dk}:${data[dk]}\n`;
        });
      }
      // console.log(str);
    }
    // console.log(
    //   'BaseSetting.api + endpoint + qs====>>>>',
    //   BaseSetting.api + endpoint + qs,
    // );
    fetch(BaseSetting.api + endpoint + qs, params)
      .then(response => response.json())
      .then(resposeJson => {
        if (
          resposeJson?.status == 401 ||
          resposeJson?.status == 403 ||
          resposeJson?.status == 404
        ) {
        } else if (
          isObject(resposeJson) &&
          isString(resposeJson.message) &&
          resposeJson.message === 'Unauthorized' &&
          endpoint !== 'delete-token'
        ) {
          console.log('Unauthorized===>>>');
          removeToken(token, uuid);

          // navigation.navigate('RedirectLS');
          resolve(resposeJson);
        } else {
          resolve(resposeJson);
        }
      })
      .catch(err => {
        console.log('error_apihelper', err);

        reject(err);
      });
  });
}

export function getApiDataProgress(
  endpoint,
  method,
  data,
  headers,
  onProgress,
) {
  return new Promise((resolve, reject) => {
    const url = BaseSetting.api + endpoint;
    const oReq = new XMLHttpRequest();
    const authState = store?.getState() || {};
    const {token} = authState?.auth?.accessToken || '';
    oReq.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        const progress = (event.loaded * 100) / event.total;
        if (onProgress) {
          onProgress(progress);
        }
      } else {
        // Unable to compute progress information since the total size is unknown
      }
    });

    const query = new FormData();
    if (data && Object.keys(data).length > 0) {
      Object.keys(data).map(k => query.append(k, data[k]));
    }
    const params = query;
    oReq.open(method, url, true);
    oReq.setRequestHeader('Content-Type', 'multipart/form-data');
    if (isObject(headers)) {
      Object.keys(headers).map(hK => {
        oReq.setRequestHeader(hK, headers[hK]);
      });
    }

    if (token) {
      oReq.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    oReq.send(params);
    oReq.onreadystatechange = () => {
      if (oReq.readyState === XMLHttpRequest.DONE) {
        try {
          const resposeJson = JSON.parse(oReq.responseText);
          if (!__DEV__) {
            // added log request for url, params and status
            Bugsnag.notify('Log Request', {
              metaData: {
                requestUrl: url,
                requestData: params,
                responseStatus: resposeJson?.status,
              },
            });
          }
          if (
            resposeJson?.status == 401 ||
            resposeJson?.status == 403 ||
            resposeJson?.status == 404
          ) {
            if (isAuthFail === false) {
              isAuthFail = true;
              Toast.show({
                text1: 'CooQu',
                text2: resposeJson?.data?.message?.toString(),
              });
            }
            // resolve(resposeJson);
          } else if (
            isObject(resposeJson) &&
            isString(resposeJson.message) &&
            resposeJson.message === 'Unauthorized' &&
            endpoint !== 'delete-token'
          ) {
            resolve(resposeJson);
          } else {
            resolve(resposeJson);
          }
        } catch (exe) {
          console.log('error', exe);
          reject(exe);
        }
      }
    };
  });
}
