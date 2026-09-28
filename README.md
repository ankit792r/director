# Go - Webview template
Simple go + webview with bidirectional communication between webview and go host

**go webview** `github.com/abemedia/go-webview`

### Webview -> GO

```go
// Webview -> GO
err := w.Bind("hostInvoke", func(method string, params any) any {
    fmt.Println("hostInvoke", method, params)
    return "pong"
})
```

### Go -> Webview

```go
// GO -> Webview
w.Dispatch(func() {
    w.Eval(fmt.Sprintf(
        `window.hostEvent("%s", "%s")`,
        "count",
        strconv.Itoa(count),
    ))
})
```

### Webview global declartion
```ts
declare global {
	interface Window {
		hostInvoke: <T>(method: string, params: any) => Promise<T>;
		hostEvent: (event: string, payload: any) => Promise<void>;
	}
}
```

### Client Side Usage
```ts
export function App() {
  useEffect(() => {
    window.hostEvent = async (event, playload) => {
      console.log("Received from HOST:", event, playload);
    }
  }, []);

  const invokeHost = () => {
    window.hostInvoke<string>("getVersion", {}).then((version) => {
      console.log(version);
    });
  }

  return (
    <div>
      <h1>Hello, World!</h1>
      <button onClick={invokeHost}>Invoke HOST</button>
    </div>
  )
}
```