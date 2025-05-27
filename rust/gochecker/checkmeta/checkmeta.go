package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/pelletier/go-toml"
	"log"
	"os"
	"path/filepath"
)

func main() {
	tomlFilePath := flag.String("file", "Anchor.toml", "Path to the Cargo.toml file")
	idlDir := flag.String("idl", "target/idl", "Path to the IDL directory")
	programNameArg := flag.String("program", "", "Name of the program to update (optional)")

	flag.Parse()

	config, err := toml.LoadFile(*tomlFilePath)
	if err != nil {
		log.Fatalf("Error loading Cargo.toml file: %v\n", err)
	}

	localnetPrograms := config.Get("programs.localnet").(*toml.Tree)
	if localnetPrograms == nil {
		log.Fatalf("No programs.localnet section found in the Cargo.toml file.\n")
	}

	// Check if a specific program is provided
	if *programNameArg != "" {
		address, ok := localnetPrograms.Get(*programNameArg).(string)
		if !ok || address == "" {
			log.Fatalf("No valid address found for program: %s\n", *programNameArg)
		}
		updateProgram(*idlDir, *programNameArg, address)
	} else {
		// No specific program provided, iterate through all localnet programs
		for programName, value := range localnetPrograms.ToMap() {
			address, ok := value.(string)
			if !ok || address == "" {
				log.Printf("Invalid or empty address for program: %s\n", programName)
				continue
			}
			updateProgram(*idlDir, programName, address)
		}
	}
}

// updateProgram updates the address in the IDL file for the specified program
func updateProgram(idlDir string, programName string, address string) {
	jsonFilePath := filepath.Join(idlDir, fmt.Sprintf("%s.json", programName))
	jsonData, err := os.ReadFile(jsonFilePath)
	if err != nil {
		log.Printf("Error reading JSON file %s: %v\n", jsonFilePath, err)
		return
	}

	var idl map[string]interface{}
	err = json.Unmarshal(jsonData, &idl)
	if err != nil {
		log.Printf("Error parsing JSON file %s: %v\n", jsonFilePath, err)
		return
	}

	metadata, ok := idl["metadata"].(map[string]interface{})
	if !ok {
		metadata = make(map[string]interface{})
		idl["metadata"] = metadata
	}

	currentAddress, exists := metadata["address"].(string)
	if exists && currentAddress == address {
		return
	}

	metadata["address"] = address

	updatedData, err := json.MarshalIndent(idl, "", "  ")
	if err != nil {
		log.Printf("Error marshalling JSON data for file %s: %v\n", jsonFilePath, err)
		return
	}

	err = os.WriteFile(jsonFilePath, updatedData, 0644)
	if err != nil {
		log.Printf("Error writing updated JSON file %s: %v\n", jsonFilePath, err)
		return
	}

	fmt.Printf("Updated %s with address %s successfully.\n", jsonFilePath, address)
}
