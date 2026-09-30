import { useAppState } from "../state/appState"

export function StatusBar() {
    const { error, loading } = useAppState()
    return (
        <div style={styles.container}>
            <span>{error ?? (loading ? "loading" : "")}</span>
        </div>
    )
}

const styles = {
    container: {
        padding: "0.35rem 0.75rem",
        background: "var(--panel)",
        borderTop: "1px solid var(--border)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
}