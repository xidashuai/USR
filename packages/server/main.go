package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
	"log"
	"net/http"
	"qny/middleware"
	"qny/models"
)

func main() {
	r := gin.Default()
	//添加新用户
	r.POST("/adduser", middleware.Jwt,models.Createuser)
	//加入房间开启ws
	r.GET("/addroom", middleware.Jwt,models.Addroom)
	//更新用户名
	r.POST("/updateusername",middleware.Jwt, models.Updateusername)
	//创建房间
	r.POST("/createroom",middleware.Jwt, models.Createroom)
	//获取公共房间列表
	r.GET("/getroomlist",middleware.Jwt, models.Getroomlist)
	//进入房间获得状态
	r.GET("/getroomstatus",models.Roomexist)

	//socket.io实现的websocket方法
	server := socketio.NewServer(nil)
	// 连接成功
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		// 申请一个房间
		var i =0
		handlerst:=s.URL().RawQuery
		for ;i<=15;i++{
			if handlerst[i]=='&'{
				break
			}
		}
		newroomid:=s.URL().RawQuery[7:i]
		fmt.Println(newroomid)
		s.Join(newroomid)
		fmt.Println("连接成功：", s.ID())
		return nil
	})
	// 接收”bye“事件
	server.OnEvent("/", "bye", func(s socketio.Conn, msg string) string {
		last := s.Context().(string)
		s.Emit("bye", msg)
		fmt.Println("============>", last)
		//s.Close()
		return last
	})
	//接收message事件
	server.OnEvent("/", "message", func(s socketio.Conn, msg string) string {
		s.SetContext(msg)
		fmt.Println("=====chat====>", msg)
		var umjsonmsg models.Receivexy //解序列化结构
		err1:=json.Unmarshal([]byte(msg),&umjsonmsg)
		if err1!=nil{
			log.Println(err1)
		}
		server.BroadcastToRoom("", umjsonmsg.Roomid, "chatmessage", &umjsonmsg)
		return "recv " + msg
	})

	// 连接错误
	server.OnError("/", func(s socketio.Conn, e error) {
		log.Println("连接错误:", e)

	})
	// 关闭连接
	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		log.Println("关闭连接：", reason)
	})

	go server.Serve()
	defer server.Close()
//socket.io实现的websocket
	r.GET("/socket.io/*any", gin.WrapH(server))
	//r.POST("/socket.io/*any", gin.WrapH(server))
	r.StaticFS("/public", http.Dir("../asset"))
	runerr:=r.Run(":8080")
	if runerr!=nil{
		log.Println(runerr)
	}
}
