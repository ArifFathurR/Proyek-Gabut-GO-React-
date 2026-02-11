package middleware

import "net/http"

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		origin := r.Header.Get("Origin")
		// Allow any localhost origin for development
		if origin != "" && (origin == "http://localhost:5173" || origin == "http://localhost:5174" || origin == "http://localhost:5175") {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		// Better yet, for dev, let's just allow all localhost ports dynamically if needed,
		// but for now I'll just add 5175 to the list to be explicit and safe.
		// Actually, let's use a more flexible check for localhost since it keeps changing.
		// NOTE: I need to import "strings" if I use HasPrefix.
		// Let's stick to the list for now to avoid import errors without seeing the full file usage of imports.
		// Wait, I can see the file content from step 359. It only imports "net/http".
		// Use exact match for now to be safe without adding imports if not necessary, or add the import.
		// Adding 5175 is safest.
		if origin == "http://localhost:5173" || origin == "http://localhost:5174" || origin == "http://localhost:5175" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
