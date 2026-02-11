package repository

import (
	"database/sql"
	"fmt"

	"github.com/user/book-api/internal/models"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(user *models.User) error {
	query := "INSERT INTO users (username, password_hash) VALUES (?, ?)"
	result, err := r.DB.Exec(query, user.Username, user.PasswordHash)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get inserted id: %w", err)
	}
	user.ID = int(id)
	return nil
}

func (r *UserRepository) GetByUsername(username string) (*models.User, error) {
	query := "SELECT id, username, password_hash FROM users WHERE username = ?"
	row := r.DB.QueryRow(query, username)

	var user models.User
	if err := row.Scan(&user.ID, &user.Username, &user.PasswordHash); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return &user, nil
}
