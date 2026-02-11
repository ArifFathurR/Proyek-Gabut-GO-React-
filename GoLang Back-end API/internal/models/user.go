package models

type User struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	Password     string `json:"password,omitempty"` // Used for input only
	PasswordHash string `json:"-"`                  // stored in DB, not JSON
}
