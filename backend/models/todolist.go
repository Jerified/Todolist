package models

import (
	"time"
)

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique;not null"`
	Email    string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	Todos    []Todo `gorm:"foreignKey:UserID"`
}

type Todo struct {
	ID        uint      `gorm:"primaryKey"`
	Text      string    `gorm:"size:255"`
	Checked   bool      `gorm:"default:false"`
	Time      string    `gorm:"default:15"`
	UserID    uint      `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (User) TableName() string {
	return "users"
}

func (Todo) TableName() string {
	return "todo_list"
}
