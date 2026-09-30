import { useAppState } from "../state/appState"

export function PathBar() {
    const { cwd, loading } = useAppState()
    return (
        <div style={styles.container}>
            <span>{cwd || (loading ? "…" : "")}</span>
        </div>
    )
}

const styles = {
    container: {
        padding: "0.35rem 0.75rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
}