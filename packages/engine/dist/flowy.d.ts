type GrabHandler = (block: Block) => void;
type ReleaseHandler = () => void;
type SnappingHandler = (drag: HTMLElement, first: boolean, parent?: HTMLElement) => boolean;
type RearrangegHandler = (drag: HTMLElement, parent: Block) => boolean;
interface Block {
    childwidth: number;
    parent: number;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
interface Output {
    html: string;
    blockarr: Array<Block>;
    blocks: Array<any>;
}
export class FlowyObject {
    #private;
    load: () => void;
    import: (output: Output) => void;
    output: () => Output | undefined;
    deleteBlocks: () => void;
    beginDrag: (event: any) => void;
    endDrag: (event: any) => void;
    moveBlock: (event: any) => void;
    constructor(canvas: HTMLCanvasElement, grab?: GrabHandler, release?: ReleaseHandler, snapping?: SnappingHandler, rearrange?: RearrangegHandler, spacing_x?: number, spacing_y?: number);
}
export const newflowy: (canvas: HTMLCanvasElement, grab?: GrabHandler, release?: ReleaseHandler, snapping?: SnappingHandler, rearrange?: RearrangegHandler, spacing_x?: number, spacing_y?: number) => FlowyObject;
