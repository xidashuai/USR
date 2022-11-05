package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"qny/models"
)

func main() {
	r := gin.Default()
	//添加新用户
	r.POST("/adduser", models.Createuser)
	//加入房间开启ws
	r.GET("/addroom", models.Addroom)
	//更新用户名
	r.POST("/updateusername", models.Updateusername)
	//创建房间
	r.POST("/createroom", models.Createroom)
	//获取公共房间列表
	r.GET("/getroomlist", models.Getroomlist)

	runerr:=r.Run(":8080")
	if runerr!=nil{
		log.Println(runerr)
	}
}
