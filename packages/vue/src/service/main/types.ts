export interface IAddUserRequest {
  ID: number
  username: string
}

export interface IGetRoomInfo {
  issucceed: boolean
  msg: string
}

export interface IRoomInfo {
  issucceed: boolean
  msg: {
    ID: number
    Owner: {
      ID: number
      username: string
    }
    Ownerid: string
    Public: number
    Roomname: string
  }
}
