type GrabHandler        = ( block:any ) => void 
type ReleaseHandler     = () => void 
type SnappingHandler    = (drag:any, first:any, parent:any ) => boolean
type RearrangegHandler   = (drag:any, parent:any) => boolean
type Point              = { x:number, y:number }

interface Block {
    childwidth: number
    parent: number
    id: number
    x: number
    y: number
    width: number
    height: number

}

interface BlockData {
    id: number
    parent: number
    data: Array<{ name: string | null, value: string }>
    attr: Array<Record<string, any>>
}

interface Output {
    html: string
    blockarr: Array<Block>
}

interface FlowyObject {

    load: () => void 
}