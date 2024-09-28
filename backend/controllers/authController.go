package controllers


import (
	"strconv"
	"log"
	// "fmt"
	"os"
	"time"
	"todolist/config"
	"todolist/models"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret []byte

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	secret := os.Getenv("AUTH_SECRET")
	if secret == "" {
		log.Fatal("AUTH_SECRET not set in .env file")
	}

	jwtSecret = []byte(secret)
}

func Signup(c *fiber.Ctx) error {
	var data map[string]string

	// Parse body
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Encrypt password
	password, err := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error encrypting password"})
	}

	// Create user object
	user := models.User{
		Username: data["username"],
		Email:    data["email"],
		Password: string(password),
	}

	// Check if email already exists
	var existingUser models.User
	if err := config.DB.Where("email = ?", data["email"]).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email already in use"})
	}

	// Save user in DB
	if result := config.DB.Create(&user); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Username already in use",
			"details": result.Error.Error(),
		})
	}

	// Success
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User created successfully"})
}


func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var user models.User
	config.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"])); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	userIDStr := strconv.Itoa(int(user.ID))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    userIDStr,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(72 * time.Hour)),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not login"})
	}

	// Set the JWT as an HTTP-only cookie
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    tokenString,
		Expires:  time.Now().Add(72 * time.Hour),
		HTTPOnly: true,
		Secure:   true, 
		SameSite: "None",
	})

	return c.JSON(fiber.Map{"message": "Logged in successfully"})
}

func Logout(c *fiber.Ctx) error {
	// Clear the JWT cookie
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour), // Set expiration to past to delete the cookie
		HTTPOnly: true,
	})

	return c.JSON(fiber.Map{"message": "Logged out successfully"})
}

func GetUser(c *fiber.Ctx) error {
    cookie := c.Cookies("jwt")
    if cookie == "" {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
    }

    token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fiber.ErrUnauthorized
        }
        return jwtSecret, nil
    })

    if err != nil || !token.Valid {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired JWT"})
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        userIDStr, ok := claims["iss"].(string)
        if !ok {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token data"})
        }

        userID, err := strconv.Atoi(userIDStr)
        if err != nil {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID"})
        }

        var user models.User
        if result := config.DB.Preload("Todos").First(&user, userID); result.Error != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not fetch user"})
        }

        user.Password = ""

        return c.JSON(fiber.Map{
            "id":       user.ID,
            "username": user.Username,
            "email":    user.Email,
            "todos":    user.Todos,
        })
    }

    return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
}


