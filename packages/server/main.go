package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
	"log"
	"net/http"
	"qny/middleware"
	"qny/models"
)

// GinMiddleware 跨域处理
func GinMiddleware(allowOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-CSRF-Token, Token, session, Origin, Host, Connection, Accept-Encoding, Accept-Language, X-Requested-With")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Request.Header.Del("Origin")

		c.Next()
	}
}
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
		models.Broom[s.ID()]=newroomid
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
	server.OnEvent("/", "pages-updated", func(s socketio.Conn, msg string) string {
		s.SetContext(msg)
		fmt.Println("=====chat====>", msg)
		//var umjsonmsg models.Receivexy //解序列化结构
		//err1:=json.Unmarshal([]byte(msg),&umjsonmsg)
		//if err1!=nil{
		//	log.Println(err1)
		//}
		room:=models.Broom[s.ID()]
		server.BroadcastToRoom("", room, "chatmessage", msg)
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
   r.Use(GinMiddleware("http://localhost:8080"))
	r.GET("/socket.io/*any", gin.WrapH(server))
	//r.POST("/socket.io/*any", gin.WrapH(server))
	r.StaticFS("/public", http.Dir("../asset"))
	runerr:=r.Run(":8080")
	if runerr!=nil{
		log.Println(runerr)
	}
}
