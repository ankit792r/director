import { useAppState } from "../state"

export function PathBar() {
    const { cwd, loading } = useAppState()
    return (
        <div class="path-bar">
            <span>{cwd || (loading ? "…" : "")}</span>
        </div>
    )
}
