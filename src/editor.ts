import * as vscode from "vscode";

/**
 * The current selection in the active editor.
 */
type Selection = {
    startLine: number,
    endLine: number,
    singleLine: boolean,
}

/**
 * The currently active editor.
 */
export class Editor {
    #editor: vscode.TextEditor;

    constructor(activeEditor: vscode.TextEditor | undefined) {
        if (!activeEditor) {
            throw new Error("No active editor");
        }

        this.#editor = activeEditor;
    }

    /**
     * The absolute path of the currently open file.
     */
    get currentFileAbsolutePath(): string {
        return this.#editor.document.uri.fsPath;
    }

    /**
     * The lines currently selected in the editor.
     */
    get currentSelection(): Selection {
        return {
            startLine: this.#editor.selection.start.line + 1,
            endLine: this.#editor.selection.end.line + 1,
            singleLine: this.#editor.selection.isSingleLine,
        };
    }
}