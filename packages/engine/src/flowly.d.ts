type GrabHandler        = ( block:Block ) => void 
type ReleaseHandler     = () => void 
type SnappingHandler    = (drag:HTMLElement, first:boolean, parent?:HTMLElement ) => boolean
type RearrangegHandler   = (drag:HTMLElement, parent:Block) => boolean
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
    blocks: Array<any>
}

type ActionType = 'drop' | 'rearrange'