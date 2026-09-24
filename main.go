package main

import (
	"director/backbone/command"
	"os"
)

func main() {
	if err := command.Execute(); err != nil {
		os.Exit(1)
	}
}
