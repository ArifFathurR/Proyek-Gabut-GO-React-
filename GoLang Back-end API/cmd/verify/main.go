package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

const baseURL = "http://localhost:8080"

func main() {
	// 1. Register User
	username := fmt.Sprintf("user_%d", time.Now().Unix())
	password := "password123"
	fmt.Printf("Registering user: %s\n", username)

	registerPayload := map[string]string{"username": username, "password": password}
	if err := request("POST", "/register", registerPayload, ""); err != nil {
		fmt.Printf("Registration failed (might already exist): %v\n", err)
	}

	// 2. Login
	fmt.Println("Logging in...")
	loginPayload := map[string]string{"username": username, "password": password}
	loginResp, err := requestWithResponse("POST", "/login", loginPayload, "")
	if err != nil {
		fatal("Login failed", err)
	}

	var tokenMap map[string]string
	if err := json.Unmarshal(loginResp, &tokenMap); err != nil {
		fatal("Failed to parse token", err)
	}
	token := tokenMap["token"]
	if token == "" {
		fatal("Token is empty", nil)
	}
	fmt.Println("Got JWT Token.")

	// 3. Create Book (Protected)
	fmt.Println("Creating book...")
	book := map[string]interface{}{
		"title":     "Secured Go",
		"author":    "Security Expert",
		"year":      2024,
		"image_url": "http://example.com/image.png",
	}
	if err := request("POST", "/books", book, token); err != nil {
		fatal("Failed to create book", err)
	}
	fmt.Println("Book created.")

	// 4. Get All Books (Protected)
	fmt.Println("Listing books...")
	if err := request("GET", "/books", nil, token); err != nil {
		fatal("Failed to list books", err)
	}
	fmt.Println("Books listed.")
}

func request(method, path string, payload interface{}, token string) error {
	_, err := requestWithResponse(method, path, payload, token)
	return err
}

func requestWithResponse(method, path string, payload interface{}, token string) ([]byte, error) {
	var body io.Reader
	if payload != nil {
		jsonBytes, _ := json.Marshal(payload)
		body = bytes.NewBuffer(jsonBytes)
	}

	req, err := http.NewRequest(method, baseURL+path, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

func fatal(msg string, err error) {
	if err != nil {
		fmt.Printf("%s: %v\n", msg, err)
	} else {
		fmt.Println(msg)
	}
	os.Exit(1)
}
