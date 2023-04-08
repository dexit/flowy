import { LitElement } from "lit";
export type SnappingHandler = (drag: HTMLElement, first: boolean, parent?: HTMLElement) => boolean;
export type RearrangegHandler = (drag: HTMLElement, parent: Block) => boolean;
export interface Block {
    childwidth: number;
    parent: number;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface BlockData {
    id: number;
    parent: number;
    data: Array<{
        name: string | null;
        value: string;
    }>;
    attr: Array<Record<string, any>>;
}
export interface Output {
    html: string;
    blockarr: Array<Block>;
    blocks: Array<any>;
}
export const createOrUpdateArrow: (id: string | HTMLElement, x: number, y: number, paddingy?: number, start_x?: number) => HTMLElement;
export class FlowyDiagram extends LitElement {
    #private;
    _canvas: HTMLCanvasElement;
    _indicator: HTMLElement;
    spacing_x: number;
    spacing_y: number;
    registerSnapping(handler: SnappingHandler): void;
    registerRearrange(handler: RearrangegHandler): void;
    render(): import("lit-html").TemplateResult<1>;
    load: () => void;
    import: (output: Output) => void;
    output: () => Output | undefined;
    deleteBlocks: () => void;
    beginDrag: (event: any) => void;
    endDrag: (event: any) => void;
    moveBlock: (event: any) => void;
    addBlock: (block?: Omit<Block, 'height'> & Partial<Pick<Block, 'height'>>) => void;
    /**
     * disable shadow root
     *
     * @returns
     * @see [How to create LitElement without Shadow DOM?](https://stackoverflow.com/a/55213037/521197)
     */
    createRenderRoot(): this;
    connectedCallback(): void;
    firstUpdated(): void;
}
