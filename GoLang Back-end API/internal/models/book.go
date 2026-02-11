package models

type Book struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Author   string `json:"author"`
	Year     int    `json:"year"`
	ImageURL string `json:"image_url"`
	UserID   int    `json:"user_id"`
	Status   string `json:"status"`
}
