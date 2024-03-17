package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Age       int    `json:"age"`
}

type City struct {
	Address string `json:"address"`
	City    string `json:"city"`
	State   string `json:"state"`
	Country string `json:"country"`
}

var db *sql.DB

func main() {
	// Manually set the variables
	dbUser := "gouser"
	dbPassword := "Bogey2012!"
	dbName := "userdb"

	connStr := fmt.Sprintf("%s:%s@tcp(localhost:3306)/%s", dbUser, dbPassword, dbName)
	log.Println("Connection String:", connStr)

	var err error
	db, err = sql.Open("mysql", connStr)
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}
	defer db.Close()

	/* Serve static files from the 'public' directory
	fs := http.FileServer(http.Dir("~/project/ts_project/frontend/public"))
	http.Handle("/", fs)
	*/

	// Serve static files from the 'public' directory
	publicDir := "/home/pi/projects/ts_project/frontend/public" // Replace this with the absolute path
	fs := http.FileServer(http.Dir(publicDir))
	http.Handle("/", fs)

	http.HandleFunc("/submit-user-data", submitHandler)
	http.HandleFunc("/submit-address-data", citySubmitHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server is listening on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, logRequest(http.DefaultServeMux)))
}

// logRequest wraps an http.Handler to log requests.
func logRequest(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)
	})
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to submit user data")
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println("Error decoding JSON data:", err)
		http.Error(w, "Error decoding JSON data", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO user (first_name, last_name, age) VALUES (?, ?, ?)"
	_, err := db.Exec(query, user.FirstName, user.LastName, user.Age)
	if err != nil {
		log.Println("Error inserting into database:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Inserted into database:", user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Form submitted successfully"})
}

func citySubmitHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to submit city data")
	var city City
	if err := json.NewDecoder(r.Body).Decode(&city); err != nil {
		log.Println("Error decoding JSON data:", err)
		http.Error(w, "Error decoding JSON data", http.StatusBadRequest)
		return
	}

	query := "INSERT INTO cities (address, city, state, country) VALUES (?, ?, ?, ?)"
	_, err := db.Exec(query, city.Address, city.City, city.State, city.Country)
	if err != nil {
		log.Println("Error inserting into database:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Inserted into database:", city)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Form submitted successfully"})
}
