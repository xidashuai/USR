package models
import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var Db *gorm.DB //数据库指针

//初始化数据库
func init() {
	var err error

	dsn := "xds:Qq3318055.@tcp(114.115.176.43:3306)/rtc?parseTime=true&loc=Local"
	Db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	}

}
