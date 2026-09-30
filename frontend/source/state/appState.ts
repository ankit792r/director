import { useContext } from "preact/hooks"
import { AppStateContext } from "./AppStateProvider"
import type { AppState } from "../types/state"

export { AppStateProvider } from "./AppStateProvider"
export { createInitialAppState } from "./createInitialAppState"
export type { AppStatePatch, AppStateContextValue } from "./AppStateProvider"

function useAppStateContext() {
    const ctx = useContext(AppStateContext)
    if (!ctx) {
        throw new Error("useAppState must be used within AppStateProvider")
    }
    return ctx
}

export function useAppState(): AppState {
    return useAppStateContext().state
}

export function useUpdateAppState() {
    return useAppStateContext().update
}
