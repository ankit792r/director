import { render } from "preact"
import "./index.css"
import { App } from "./app.tsx"
import { AppStateProvider } from "./state/appState"

render(
    <AppStateProvider>
        <App />
    </AppStateProvider>,
    document.getElementById("app")!,
)
