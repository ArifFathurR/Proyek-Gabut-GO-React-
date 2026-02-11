package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

const baseURL = "http://localhost:8080"

func main() {
	// 1. Register/Login to get token
	username := fmt.Sprintf("upload_test_%d", time.Now().Unix())
	password := "password123"
	if err := request("POST", "/register", map[string]string{"username": username, "password": password}, ""); err != nil {
		fmt.Printf("Register/Login warning: %v\n", err)
	}

	loginResp, err := requestWithResponse("POST", "/login", map[string]string{"username": username, "password": password}, "")
	if err != nil {
		fatal("Login failed", err)
	}
	var tokenMap map[string]string
	json.Unmarshal(loginResp, &tokenMap)
	token := tokenMap["token"]
	fmt.Println("Got Token:", token)

	// 2. Upload File
	fmt.Println("Uploading file...")
	fileContent := []byte("fake image content")
	fileName := "test_image.png"

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", fileName)
	if err != nil {
		fatal("CreateFormFile failed", err)
	}
	part.Write(fileContent)
	writer.Close()

	req, _ := http.NewRequest("POST", baseURL+"/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+token) // Just in case, though currently not enforced

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fatal("Upload request failed", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != 200 {
		fatal(fmt.Sprintf("Upload failed with status %d: %s", resp.StatusCode, string(respBody)), nil)
	}

	var uploadResp map[string]string
	json.Unmarshal(respBody, &uploadResp)
	imageURL := uploadResp["url"]
	fmt.Println("Uploaded Image URL:", imageURL)

	// 3. Create Book with Image URL
	fmt.Println("Creating book with image...")
	book := map[string]interface{}{
		"title":     "Book with Image",
		"author":    "Tester",
		"year":      2025,
		"image_url": imageURL,
	}

	createResp, err := requestWithResponse("POST", "/books", book, token)
	if err != nil {
		fatal("Create book failed", err)
	}
	fmt.Println("Book Create Response:", string(createResp))

	fmt.Println("Success! Backend logic seems correct.")
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
