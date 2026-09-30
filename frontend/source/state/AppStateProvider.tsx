import { createContext } from "preact"
import { useCallback, useState } from "preact/hooks"
import type { ComponentChildren } from "preact"
import type { AppState } from "../types/state"
import { createInitialAppState } from "./createInitialAppState"

export type AppStatePatch = Partial<AppState> | ((prev: AppState) => Partial<AppState>)

export type AppStateContextValue = {
    state: AppState
    update: (patch: AppStatePatch) => void
}

export const AppStateContext = createContext<AppStateContextValue | null>(null)

type AppStateProviderProps = {
    children: ComponentChildren
}

export function AppStateProvider({ children }: AppStateProviderProps) {
    const [state, setState] = useState<AppState>(createInitialAppState)

    const update = useCallback((patch: AppStatePatch) => {
        setState((prev) => ({
            ...prev,
            ...(typeof patch === "function" ? patch(prev) : patch),
        }))
    }, [])

    return (
        <AppStateContext.Provider value={{ state, update }}>{children}</AppStateContext.Provider>
    )
}
