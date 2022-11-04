package models

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func  Createuser(context *gin.Context)  {
	name:=context.PostForm("name")
	var newuser User
	newuser.Username=name
	Db.AutoMigrate(&User{})
	Db.Create(&newuser)
	context.JSON(200,gin.H{
		"issucceed":true,
		"user":newuser,
	})
}
func Updateusername (context *gin.Context){
	newname:=context.PostForm("newname")
	userid:=context.PostForm("userid")
	tx:=Db.Model(&User{}).Where("id=?",userid).Update("username",newname)
	if tx.RowsAffected ==0{
		context.JSON(200,gin.H{
			"issucceed":false,
			"msg":"更改昵称失败",
		})
		return
	}
	context.JSON(200,gin.H{
		"issucceed":true,
		"msg":"更改昵称成功",
	})
}

type User struct {
	gorm.Model
	Username string `json:"username"`
}
