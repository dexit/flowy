import { LitElement } from "lit";
type addElementParameters = {
    image_url: URL;
    title: string;
    description: string;
    value?: number;
    type: 'element' | 'template' | 'propertysheet';
};
export function createElement(params: addElementParameters): import("lit-html").TemplateResult<1> | undefined;
export class FlowyElement extends LitElement {
    type: 'element' | 'template' | 'propertysheet';
    value?: number;
    image_url?: URL;
    title: string;
    description: string;
    constructor();
    /**
     * disable shadow root
     *
     * @returns
     * @see [How to create LitElement without Shadow DOM?](https://stackoverflow.com/a/55213037/521197)
     */
    createRenderRoot(): this;
    protected render(): import("lit-html").TemplateResult<1> | undefined;
}
