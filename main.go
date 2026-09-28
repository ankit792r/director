package main

import (
	"director/backbone/webview"
	"fmt"
	"os"
)

func main() {
	if err := webview.OpenUi(); err != nil {
		fmt.Println("Error opening UI:", err)
		os.Exit(1)
	}
}
