
// import QS from 'qs'
import axios from 'axios'
import localStore from '@/utils/localStore'

let token = localStore.get('token')

const baseURL = 'https://iot.youjiaoyun.net'

// const instance = axios.create({
//   baseURL
// })

function getAuth() {
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
}

async function authWrapper(func) {
  try {
    return await func(null)
  } catch (e) {
    console.log(e)
    if (e.response.status === 401) {
      await getToken()
      return func(null)
    } else {
      throw e
    }
  }
}

function parseResp(resp) {
  const {
    data: {
      code,
      message
    }
  } = resp
  if (code !== 0) {
    const err = new Error(message)
    err.code = code
    throw err
  }
  return resp.data.data
}

async function get({
  path,
  params
}) {
  const resp = await authWrapper(() => {
    return axios({
      method: 'get',
      baseURL,
      url: path,
      params: params,
      headers: {
        ...(getAuth().headers)
      }
    })
  })
  return parseResp(resp)
}

export async function getToken() {
  const tokenRes = await axios({
    method: 'post',
    url: `${baseURL}/auth/login/token`,
    params: {
      username: 'admin',
      password: 'admin400600'
    },
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  })
  token = tokenRes.data.data.access_token
  localStore.set('token', token)
}

// 获取班级信息
export const getClassList = (params) => {
  return get({
    path: '/ywt/bhyfclass/infos',
    params
  })
}

// 班级学生
export const getStudentList = (params) => {
  return get({
    path: '/ywt/ywt/studentlist',
    params
  })
}

// 出勤
export const getAttendanceList = (params) => {
  return get({
    path: '/ywt/ywt/garden/classdatalist',
    params
  })
}

// 温度

export const getTempList = (params) => {
  return get({
    path: '/ywt/bdb/lasttemplistbyclass',
    params
  })
}

// 睡眠

export const getSleepList = (params) => {
  return get({
    path: '/ywt/ywt/xhbsleeppersonlist',
    params
  })
}

// 运动

export const getSportList = (params) => {
  return get({
    path: '/ywt/sport/personlist',
    params
  })
}

// 区角

export const getAngleList = (params) => {
  return get({
    path: '/ywt/angle/recordlist',
    params
  })
}

// 警报
export const getWarnList = (params) => {
  return get({
    path: 'ywt/bdb/warningtemplistbyclass',
    params
  })
}

// 手环电量信息
export const getBatteryList = (params) => {
  return get({
    path: '/ywt/bdb/watchbatterylist',
    params
  })
}

// 获取学生手环版本信息

export const getWatchVersionList = (params) => {
  return get({
    path: '/ywt/bdb/watchversionlist',
    params
  })
}

// 获取信标电量信息

export const getBeaconBatteryList = (params) => {
  return get({
    path: '/ywt/bdb/beaconbatterylist',
    params
  })
}

// 获取基站信息
export const getBaseStationList = (params) => {
  return get({
    path: '/ywt/bdb/basestationlist',
    params
  })
}

// async function post ({
//   path,
//   data
// }) {
//   const resp = await authWrapper(() => {
//     return axios.post(`${iotHost}${path}`, QS.stringify(data), {
//       ...getAuth()
//     }, {
//       headers: {
//         ...(getAuth().headers),
//         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//       }
//     })
//   })
//   return parseResp(resp)
// }

// async function getAll ({
//   path,
//   params
// }, getRecords = data => data.records) {
//   const fetchOnce = () => get({
//     path,
//     params: {
//       ...params
//       // page
//     }
//   })
//   let all = []
//   let page = 1

//   while (true) {
//     const data = await fetchOnce(page)
//     all = all.concat(getRecords(data))
//     const {
//       pages
//     } = data
//     if (parseInt(pages) <= page) {
//       break
//     }
//     page++
//   }
//   return all
// }

