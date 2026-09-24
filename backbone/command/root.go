package command

import (
	"os"

	"director/backbone/webview"

	"github.com/spf13/cobra"
)

var startPath string

var rootCommand = &cobra.Command{
	Use:   "director",
	Short: "Director is a keyboard-first file manager",
	RunE: func(cmd *cobra.Command, args []string) error {
		if startPath != "" {
			_ = os.Setenv("DIRECTOR_START_PATH", startPath)
		}
		webview.Run()
		return nil
	},
	CompletionOptions: cobra.CompletionOptions{
		DisableDefaultCmd: true,
	},
}

func init() {
	rootCommand.Flags().StringVarP(&startPath, "path", "p", "", "Directory to open on launch")
}

func Execute() error {
	return rootCommand.Execute()
}
