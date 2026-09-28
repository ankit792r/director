package main

import (
	"fmt"
	"os"
)

func main() {
	if err := OpenUI(); err != nil {
		fmt.Println("Error opening UI:", err)
		os.Exit(1)
	}
}
