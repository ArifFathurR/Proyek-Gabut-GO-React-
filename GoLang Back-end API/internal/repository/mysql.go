package repository

import (
	"database/sql"
	"fmt"

	"github.com/user/book-api/internal/models"
)

type BookRepository struct {
	DB *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{DB: db}
}

func (r *BookRepository) Create(book *models.Book) error {
	query := "INSERT INTO books (title, author, year, user_id) VALUES (?, ?, ?, ?)"
	result, err := r.DB.Exec(query, book.Title, book.Author, book.Year, book.UserID)
	if err != nil {
		return fmt.Errorf("failed to create book: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get inserted id: %w", err)
	}
	book.ID = int(id)
	return nil
}

func (r *BookRepository) GetAll(userID int) ([]models.Book, error) {
	query := "SELECT id, title, author, year, user_id FROM books WHERE user_id = ?"
	rows, err := r.DB.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get books: %w", err)
	}
	defer rows.Close()

	var books []models.Book
	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Year, &book.UserID); err != nil {
			return nil, fmt.Errorf("failed to scan book: %w", err)
		}
		books = append(books, book)
	}
	return books, nil
}

func (r *BookRepository) GetByID(id int, userID int) (*models.Book, error) {
	query := "SELECT id, title, author, year, user_id FROM books WHERE id = ? AND user_id = ?"
	row := r.DB.QueryRow(query, id, userID)

	var book models.Book
	if err := row.Scan(&book.ID, &book.Title, &book.Author, &book.Year, &book.UserID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Or return a specific error
		}
		return nil, fmt.Errorf("failed to get book: %w", err)
	}
	return &book, nil
}

func (r *BookRepository) Update(book *models.Book) error {
	query := "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ? AND user_id = ?"
	result, err := r.DB.Exec(query, book.Title, book.Author, book.Year, book.ID, book.UserID)
	if err != nil {
		return fmt.Errorf("failed to update book: %w", err)
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("book not found or unauthorized")
	}
	return nil
}

func (r *BookRepository) Delete(id int, userID int) error {
	query := "DELETE FROM books WHERE id = ? AND user_id = ?"
	result, err := r.DB.Exec(query, id, userID)
	if err != nil {
		return fmt.Errorf("failed to delete book: %w", err)
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("book not found or unauthorized")
	}
	return nil
}
