import { useAppState } from "../state/appState"

export function StatusBar() {
    const { entries } = useAppState()

    return (
        <div style={styles.container}>
            <span>{entries.length} entries found</span>
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