package controllers

import (
    "todolist/config"
    "todolist/models"

    "github.com/gofiber/fiber/v2"
)

func CreateTodo(c *fiber.Ctx) error {
    var todo models.Todo
    if err := c.BodyParser(&todo); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Get UserID from token or session (as int)
    userID, ok := c.Locals("userID").(int)
    if !ok {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Invalid user ID type"})
    }

    todo.UserID = uint(userID) // Convert int to uint

    if result := config.DB.Create(&todo); result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.Status(fiber.StatusCreated).JSON(todo)
}

func GetTodos(c *fiber.Ctx) error {
    userID, ok := c.Locals("userID").(int)
    if !ok {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Invalid user ID type"})
    }

    var todos []models.Todo
    if result := config.DB.Where("user_id = ?", uint(userID)).Find(&todos); result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }


    return c.JSON(todos)
}



func GetTodo(c *fiber.Ctx) error {
    id := c.Params("id")
    var todo models.Todo
    if result := config.DB.First(&todo, id); result.Error != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": result.Error.Error()})
    }
    return c.JSON(todo)
}

func UpdateTodo(c *fiber.Ctx) error {
    id := c.Params("id")
    var todo models.Todo
    if result := config.DB.First(&todo, id); result.Error != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": result.Error.Error()})
    }

    if err := c.BodyParser(&todo); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    if result := config.DB.Save(&todo); result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.JSON(todo)
}

func DeleteTodo(c *fiber.Ctx) error {
    id := c.Params("id")
    if result := config.DB.Delete(&models.Todo{}, id); result.Error != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.SendStatus(fiber.StatusNoContent)
}
