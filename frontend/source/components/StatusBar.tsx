import { useAppState } from "../state"

export function StatusBar() {
    const { error, loading } = useAppState()
    return (
        <div class="status-bar">
            <span>{error ?? (loading ? "loading" : "")}</span>
        </div>
    )
}
