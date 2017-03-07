export interface ElementTypeInterface {
    render(): string;

    getTarget?(data:any): string;
}