package main

import (
	"log"
	"os"
	"todolist/config"
	"todolist/models"
	"todolist/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func Handler() *fiber.App {
	// Load environment variables
	godotenv.Load(); 
    port := os.Getenv("PORT_URL")

	// Initialize JWT secret
	jwtSecret := []byte(os.Getenv("AUTH_SECRET"))

	config.Connect()

	// Migrate the schema
	config.DB.AutoMigrate(&models.User{}, &models.Todo{})

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     port,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowCredentials: true,                 
	}))


	routes.TodoRoutes(app, jwtSecret)

	return app

}

func main() {
	app := Handler()
	log.Fatal(app.Listen(":8000"))   
}
