package routes

import (
	"github.com/gofiber/fiber/v2"
	"todolist/controllers"
	"todolist/middleware"
)

func TodoRoutes(app *fiber.App, jwtSecret []byte) {
	// Public routes
	app.Post("/api/signup", controllers.Signup)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.GetUser)

	// Logout route
	app.Post("/api/logout", controllers.Logout)

	// Protected routes
	protected := app.Group("/api", middleware.AuthRequired(jwtSecret))

	protected.Get("/todos", controllers.GetTodos)
	protected.Post("/todos", controllers.CreateTodo)
	protected.Get("/todos/:id", controllers.GetTodo)
	protected.Put("/todos/:id", controllers.UpdateTodo)
	protected.Delete("/todos/:id", controllers.DeleteTodo)
}

