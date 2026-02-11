package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}
	dbPass := os.Getenv("DB_PASS")
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

	rows, err := db.Query("DESCRIBE books")
	if err != nil {
		log.Fatal("Failed to describe table:", err)
	}
	defer rows.Close()

	var field, photoType, null, key string
	var def sql.NullString
	var extra string

	fmt.Printf("%-20s %-20s\n", "Field", "Type")
	fmt.Println("---------------------------------------------")
	for rows.Next() {
		if err := rows.Scan(&field, &photoType, &null, &key, &def, &extra); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%-20s %-20s\n", field, photoType)
	}
}
