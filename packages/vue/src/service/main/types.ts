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

export interface IRoomList {
  issucceed: boolean
  room_list: [
    {
      ID: number
      Roomname: string
      Ownerid: string
      Owner: {
        ID: number
        username: string
      }
    }
  ]
  msg: string
}
