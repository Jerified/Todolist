package main

import (
	"log"
	"todolist/config"
	"todolist/models"
	"todolist/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
    config.Connect()

    // Migrate the schema
    config.DB.AutoMigrate(&models.Todo{})

    app := fiber.New()

	routes.TodoRoutes(app)

    log.Fatal(app.Listen(":8000"))
}


