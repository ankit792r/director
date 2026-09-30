import type { ListDirResponse } from "../../types/dirlist"
import type { SortBy } from "../../types/state"
import { invoke } from "../bridge"

export async function listDir(
    path: string,
    showHidden: boolean,
    sortBy: SortBy,
    sortDesc: boolean,
): Promise<ListDirResponse> {
    return invoke<ListDirResponse>("listDir", { path, showHidden, sortBy, sortDesc })
}
