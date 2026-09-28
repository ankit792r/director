import type { ListDirResponse, SortBy } from "../../types";
import { invoke } from "../bridge";

export async function listDir(path: string,
    showHidden: boolean,
    sortBy: SortBy,
    sortDesc: boolean
): Promise<ListDirResponse> {
    return invoke<ListDirResponse>("listDir", { path, showHidden, sortBy, sortDesc })
}