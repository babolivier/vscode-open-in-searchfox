/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as vscode from "vscode";
import path from "path";

export function activate(context: vscode.ExtensionContext) {
  // The main and only command for the extension.
  const disposable = vscode.commands.registerCommand(
    "vscode-open-in-searchfox.open",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      let fileUri = editor.document.uri.fsPath;

      // Attempt to identify the workspace folder that's at the root for this
      // file.
      const rootFolder = vscode.workspace.workspaceFolders?.find((folder) => {
        return fileUri.startsWith(folder.uri.fsPath);
      });

      if (!rootFolder) {
        vscode.window.showErrorMessage(
          "No active workspace folder for the current file"
        );
        return;
      }

      let rootPath = rootFolder.uri.fsPath;

      // Read the config, and check if we're in a sub-directory that's
      // associated to a specific repository.
      const config = vscode.workspace.getConfiguration("open-in-searchfox");
      const domain = config.get("domain");
      const nested: {[key:string]: string} = config.get("nested-repositories", {});
      const use_https = config.get("use-https", true);

      let repository = config.get("repository");
      for (let key in nested) {
        let fullSubDirPath = path.join(rootFolder.uri.fsPath, key);

        if (fileUri.startsWith(fullSubDirPath)) {
          rootPath = fullSubDirPath;
          repository = nested[key];
          break;
        }
      }

      // Craft the URL fragment part from the selection.
      const selection = editor.selection;
      let fragment = `${selection.start.line + 1}`;
      if (!selection.isSingleLine) {
        fragment += `-${selection.end.line + 1}`;
      }

      // Build the final URL to open, and open it in the system's default
      // browser.
      let searchfoxUrl = new URL(`https://${domain}/${repository}/source`);
      searchfoxUrl.pathname = path.join(
        searchfoxUrl.pathname,
        fileUri.replace(rootPath, "")
      );
      searchfoxUrl.hash = fragment;

      if (!use_https) {
        searchfoxUrl.protocol = "http";
      }

      import("open")
        .then((open) => open.default(searchfoxUrl.toString()))
        .catch((err) => {
          vscode.window.showErrorMessage(
            `Failed to open URL in browser: ${err}`
          );
        });
    }
  );

  context.subscriptions.push(disposable);
}

// Called when the extension is deactivated.
export function deactivate() {}
