import apiRequest from '../index'
import type { IDataType } from '../types'
import type { IAddUserRequest, IGetRoomInfo } from './types'

/**
 * 增加新用户
 * @param name
 *
 */
export function addUser(name: string) {
  return apiRequest.post<IDataType<IAddUserRequest>>({
    url: '/adduser',
    // body请求参数
    data: {
      name
    }
  })
}
/**
 * 更改呢称
 * @param userid
 * @param newname
 *
 */
export function updateUsername(userid: number, newname: string) {
  return apiRequest.post({
    url: `/updateusername`,
    data: {
      userid,
      newname
    }
  })
}
/**
 * 创建房间
 * @param ownerid
 * @param roomname
 * @param isPublic
 *
 */
export function createRoom(
  ownerid: number,
  roomname: string,
  isPublic: number
) {
  return apiRequest.post({
    url: `/createroom`,
    data: {
      ownerid,
      roomname,
      public: isPublic
    }
  })
}

/**
 * 获取房间列表
 * @param page
 */

export function getRoomList(page: number) {
  return apiRequest.get({
    url: '/getroomlist',
    params: {
      page
    }
  })
}

/**
 * 查询房间是否存在
 * @param roomid
 */
export function getRoomInfo(roomid: number) {
  return apiRequest.get<IGetRoomInfo>({
    url: '/getroomstatus',
    params: {
      roomid
    }
  })
}
