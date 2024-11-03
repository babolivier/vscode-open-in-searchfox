/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as vscode from "vscode";
import { Config } from "./config";
import { Editor } from "./editor";
import { SearchfoxUrl } from "./url";

/**
 * Generates a Searchfox URL from the current editor.
 *
 * @returns {string} - The generated Searchfox URL.
 * @throws {Error} - Will throw if there is no active editor or a root folder
 *    could not be found for the current file.
 */
function searchfoxUrlFromCurrentFile(): string {
  const editor = new Editor(vscode.window.activeTextEditor);

  // Attempt to identify the workspace folder that's at the root for this
  // file.
  const rootFolder = vscode.workspace.workspaceFolders?.find((folder) => {
    return editor.currentFileAbsolutePath.startsWith(folder.uri.fsPath);
  });

  if (!rootFolder) {
    throw new Error("No active workspace folder for the current file");
  }

  const config = new Config(
    vscode.workspace.getConfiguration("open-in-searchfox"),
    rootFolder.uri.fsPath
  );

  const url = new SearchfoxUrl(editor, config);
  return url.toString();
}

/**
 * Generates a Searchfox URL and opens it into the system's default browser.
 */
export function openInBrowser() {
  let url;
  try {
    url = searchfoxUrlFromCurrentFile();
  } catch (err) {
    if (err instanceof Error) {
      vscode.window.showErrorMessage(err.message);
    }
    return;
  }

  import("open")
    .then((open) => open.default(url))
    .catch((err) => {
      vscode.window.showErrorMessage(`Failed to open URL in browser: ${err}`);
    });
}

/**
 * Generates a Searchfox URL and copies it into the clipboard.
 */
export function copyToClipboard() {
  let url;
  try {
    url = searchfoxUrlFromCurrentFile();
  } catch (err) {
    if (err instanceof Error) {
      vscode.window.showErrorMessage(err.message);
    }
    return;
  }

  vscode.env.clipboard
    .writeText(url)
    .then(() =>
      vscode.window.showInformationMessage("Searchfox URL copied to clipboard")
    );
}
