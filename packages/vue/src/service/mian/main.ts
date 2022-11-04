import apiRequest from '../index'

/**
 * 增加新用户
 * @param name
 *
 */
export function addUser(name: string) {
  return apiRequest.request({
    url: '/users',
    method: 'POST',
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
  return apiRequest.request({
    url: `/updateusername`,
    method: 'POST',
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
export function createRoom(ownerid: number, roomname: string, isPublic: number) {
  return apiRequest.request({
    url: `/createroom`,
    method: 'POST',
    data: {
      ownerid,
      roomname,
      public:isPublic
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