import type { Entry } from "./entry"


export type ListDirResponse = {
    path: string
    parent: string
    entries: Entry[]
}
