package models

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"
)
var Roomer=make(map[string]map[string]struct{})
var Chatclient = make(map[string]*websocket.Conn)
var Rux sync.Mutex
var wsupgrader = websocket.Upgrader{
	ReadBufferSize:   1024,
	WriteBufferSize:  1024,
	HandshakeTimeout: 5 * time.Second,
	// 取消ws跨域校验
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Addroom(context *gin.Context){
roomid:= context.Query("roomid")
userid:= context.Query("userid")
wshandletlfunc(context.Writer,context.Request,roomid,userid)

}

func Createroom (context *gin.Context){
Db.AutoMigrate(&Room{})
var newroom Room
context.ShouldBind(&newroom)
 tx:=Db.Create(&newroom)
	if tx.RowsAffected ==0{
		context.JSON(200,gin.H{
			"issucceed":false,
			"msg":"创建房间失败",
		})
		return
	}
	context.JSON(200,gin.H{
		"issucceed":true,
		"msg":"创建房间成功",
	})
}
func Getroomlist (context *gin.Context){
	page:=context.Query("page")
	intpage,_:=strconv.Atoi(page)
	inpage:=intpage*10
	rlist:=make([]Room,0)
	Db.Where("public=?",0).Preload("Owner").Offset(inpage).Limit(10).Find(&rlist)
	if len(rlist)==0{
		context.JSON(200,gin.H{
			"issucceed":false,
			"msg":"暂无更多公共房间",
		})
		return
	}
	context.JSON(200,gin.H{
		"issucceed":true,
		"room_list":rlist,
	})
}



func wshandletlfunc(w http.ResponseWriter, r *http.Request, roomid string,userid string) {
	var conn *websocket.Conn //websocket客户端
	// var message lv1firstchat             //将数据解析的格式
	var err error

	//将http请求升级为webscoket链接
	conn, err = wsupgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	Rux.Lock()
    Chatclient[userid]=conn
	Roomer[roomid][userid]= struct{}{}
	Rux.Unlock()
	for{
		var Rmessage Receivexy
		err1:=conn.ReadJSON(&Rmessage)
		if err1!=nil{
			log.Println(userid+"."+roomid+"退出")
			Rux.Lock()
			delete(Chatclient,userid)
			del:=Roomer[roomid]
			delete(del,userid)
			Roomer[roomid]=del
			Rux.Unlock()
		}
		if Rmessage.Roomid!=""{
			//广播
			rom:=Roomer[roomid]
			for i:=range rom{
				con:=Chatclient[i]
				con.WriteJSON(&Rmessage)
			}
		}
		Rmessage=Receivexy{}

	}


}

type Receivexy struct{
	Roomid string
 	x float64
	y float64
}

type Room struct {
	gorm.Model
	Roomname string `form:"roomname"`
	Ownerid string  `form:"ownerid"`
	Owner User `gorm:"foreignKey:Ownerid"`
	Public int   `form:"public"`
}
