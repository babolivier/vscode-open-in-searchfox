/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import path from "path";
import { Config } from "./config";
import { Editor } from "./editor";

/**
 * A URL to the configured Searchfox instance referring to the file and line(s)
 * currently selected.
 */
export class SearchfoxUrl {
  #editor: Editor;
  #config: Config;

  constructor(editor: Editor, config: Config) {
    this.#editor = editor;
    this.#config = config;
  }

  /**
   * Builds the Searchfox URL for the current file and returns it as a string.
   *
   * @returns {string} - The URL as a string.
   */
  toString(): string {
    const [repository, filePath] =
      this.#config.repositoryAndRelativePathForFile(
        this.#editor.currentFileAbsolutePath
      );
    const protocol = this.#config.protocol;
    const domain = this.#config.domain;

    let searchfoxUrl = new URL(`${protocol}://${domain}`);
    searchfoxUrl.pathname = path.join(repository, "source", filePath);
    searchfoxUrl.hash = this.#fragment;

    return searchfoxUrl.toString();
  }

  /**
   * The URL fragment (i.e. the part after the `#` character).
   */
  get #fragment(): string {
    const selection = this.#editor.currentSelection;
    let fragment = `${selection.startLine}`;
    if (!selection.singleLine) {
      fragment += `-${selection.endLine}`;
    }

    return fragment;
  }
}
