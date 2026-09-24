package command

import (
	"director/backbone/webview"

	"github.com/spf13/cobra"
)

var rootCommand = &cobra.Command{
	Use:   "director",
	Short: "Director is a tool for managing your files",
	RunE: func(cmd *cobra.Command, args []string) error {
		webview.Run()
		return nil
	},
	CompletionOptions: cobra.CompletionOptions{
		DisableDefaultCmd: true,
	},
}

func Execute() error {
	return rootCommand.Execute()
}
