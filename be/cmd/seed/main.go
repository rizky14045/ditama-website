package main

import (
	"log"
	"template/config"
	"template/database"
	"template/database/seeder"
)

func main() {
	log.Println("Starting standalone database seeder...")

	if err := config.LoadEnv(); err != nil {
		log.Printf("Warning: failed to load .env: %v", err)
	}

	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	if err := seeder.Seed(db); err != nil {
		log.Fatalf("Seeding failed: %v", err)
	}

	log.Println("Database seeder executed successfully!")
}
