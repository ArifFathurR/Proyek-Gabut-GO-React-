package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/user/book-api/internal/handlers"
	"github.com/user/book-api/internal/middleware"
	"github.com/user/book-api/internal/repository"
)

func main() {
	// Database connection setup
	// Format: username:password@tcp(host:port)/dbname
	// Default to a common local setup if env vars aren't set
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}
	dbPass := os.Getenv("DB_PASS")
	// Removed default "password" to allow empty password for local dev (e.g. Laragon)
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost:3306"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "books"
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", dbUser, dbPass, dbHost, dbName)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("Could not connect to database:", err)
	}

	// Initialize repository and handlers
	userRepo := repository.NewUserRepository(db)
	authHandler := handlers.NewAuthHandler(userRepo)

	bookRepo := repository.NewBookRepository(db)
	bookHandler := handlers.NewBookHandler(bookRepo)

	// Setup routes using Go 1.22+ explicit method matching
	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("POST /register", authHandler.Register)
	mux.HandleFunc("POST /login", authHandler.Login)

	// Protected routes
	mux.HandleFunc("POST /books", middleware.AuthMiddleware(bookHandler.CreateBook))
	mux.HandleFunc("GET /books", middleware.AuthMiddleware(bookHandler.GetAllBooks))
	mux.HandleFunc("GET /books/{id}", middleware.AuthMiddleware(bookHandler.GetBookByID))
	mux.HandleFunc("PUT /books/{id}", middleware.AuthMiddleware(bookHandler.UpdateBook))
	mux.HandleFunc("DELETE /books/{id}", middleware.AuthMiddleware(bookHandler.DeleteBook))

	log.Println("Server starting on :8080")
	// Wrap mux with CORS middleware
	handler := middleware.CORSMiddleware(mux)
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
