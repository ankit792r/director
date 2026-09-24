package fs

import (
	"bytes"
	"os/exec"
)

// RunShell runs a command in the given directory.
func RunShell(req ShellRequest) (ShellResponse, error) {
	dir, err := ExpandPath(req.Dir)
	if err != nil {
		return ShellResponse{}, err
	}
	cmd := exec.Command("sh", "-c", req.Command)
	cmd.Dir = dir
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err = cmd.Run()
	code := 0
	if err != nil {
		if ee, ok := err.(*exec.ExitError); ok {
			code = ee.ExitCode()
		} else {
			return ShellResponse{}, err
		}
	}
	return ShellResponse{
		ExitCode: code,
		Stdout:   stdout.String(),
		Stderr:   stderr.String(),
	}, nil
}
