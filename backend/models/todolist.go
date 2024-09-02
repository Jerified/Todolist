package models

import (
	"time"

)

type Todo struct {
	ID      uint           `gorm:"primaryKey"`
	Text    string         `gorm:"size:255"`
	Checked bool           `gorm:"default:false"`
	Time    *time.Time     `gorm:"autoCreateTime"`
}

func (Todo) TableName() string {
	return "todo_list"
}