package routes

import (
	"todolist/controllers"

	"github.com/gofiber/fiber/v2"
)

func TodoRoutes(app *fiber.App) {
	app.Post("/api/todos", controllers.CreateTodo)
	app.Get("/api/todos", controllers.GetTodos)
	app.Get("/api/todos/:id", controllers.GetTodo)
	app.Put("/api/todos/:id", controllers.UpdateTodo)
	app.Delete("/api/todos/:id", controllers.DeleteTodo)
}
