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
var Roomer=make(map[string]map[string]struct{})//对应房间的在线成员列表，用map模拟集合加快存取速度
var Chatclient = make(map[string]*websocket.Conn)
var Rux sync.RWMutex  //加个读写锁解决map线程不安全
var wsupgrader = websocket.Upgrader{
	ReadBufferSize:   1024,
	WriteBufferSize:  1024,
	HandshakeTimeout: 5 * time.Second,
	// 取消ws跨域校验
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}


func Createroom (context *gin.Context){
Db.AutoMigrate(&Room{})
var newroom Room
var roomuser User
 err1:=context.ShouldBind(&newroom)
 if err1!=nil{
	 context.JSON(200,gin.H{
		 "issucceed":false,
		 "msg":"创建房间失败,传参有误",
	 })
	 return
 }
 result:=Db.Where("id=?",newroom.Ownerid).First(&roomuser)
 if result.RowsAffected==0{
	 context.JSON(200,gin.H{
		 "issucceed":false,
		 "msg":"创建房间失败,该用户不存在",
	 })
	 return
 }
 tx:=Db.Create(&newroom)
 newroom.Owner=roomuser
	if tx.RowsAffected ==0{
		context.JSON(200,gin.H{
			"issucceed":false,
			"msg":"创建房间失败",
		})
		return
	}
	context.JSON(200,gin.H{
		"issucceed":true,
		"msg":newroom,
	})
}

func Getroomlist (context *gin.Context){
	page:=context.Query("page")
	intpage,err1:=strconv.Atoi(page)
	if err1!=nil {
		context.JSON(200, gin.H{
			"issucceed": false,
			"msg":       "传参有误",
		})
		return
	}
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

func Addroom(context *gin.Context){
	roomid:= context.Query("roomid")
	userid:= context.Query("userid")
	log.Println(userid+" 用户进入 "+roomid+"房间 ")
	wshandletlfunc(context.Writer,context.Request,roomid,userid)
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
//写锁
	Rux.Lock()
    Chatclient[userid]=conn
	before:=Roomer[roomid]
	if before==nil{
		before=make(map[string]struct{})
	}
	before[userid]= struct{}{}
	Roomer[roomid]= before
	Rux.Unlock()
	for{
		var Rmessage Receivexy
		//读取数据且自带心跳机制
		err1:=conn.ReadJSON(&Rmessage)
		if err1!=nil{
			log.Println(userid+" 用户退出 "+roomid+"房间")
			//上锁避免map出错
			Rux.Lock()
			delete(Chatclient,userid)
			del:=Roomer[roomid]
			delete(del,userid)
			Roomer[roomid]=del
			Rux.Unlock()
			break
		}
		if Rmessage.Roomid!=""{
			//异步广播
			rom:=Roomer[roomid]
			for i:=range rom{
				go func(i string,Rmessage Receivexy) {
					if i==userid{
						return
					}
					Rux.RLock()
					con:=Chatclient[i]
					con.WriteJSON(&Rmessage)
					Rux.RUnlock()
				}(i,Rmessage)

			}
			time.Sleep(100)
		}
		Rmessage=Receivexy{}

	}


}

type Receivexy struct{
	Roomid string
 	X float64
	Y float64
}

type Room struct {
	gorm.Model
	Roomname string `form:"roomname" `
	Ownerid string  `form:"ownerid" validate:"required"`
	Owner User `gorm:"foreignKey:Ownerid"`
	Public int   `form:"public"`
}
