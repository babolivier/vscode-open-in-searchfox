/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as vscode from "vscode";
import { openInBrowser, copyToClipboard } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  const commandDisposables = [
    // A command that generates a Searchfox URL and opens it in the system's
    // default browser.
    vscode.commands.registerCommand(
      "vscode-open-in-searchfox.openInBrowser",
      () => {
        openInBrowser();
      }
    ),
    // A command that generates a Searchfox URL and copies it to the clipboard.
    vscode.commands.registerCommand(
      "vscode-open-in-searchfox.copyToClipboard",
      () => {
        copyToClipboard();
      }
    ),
  ];

  context.subscriptions.push(...commandDisposables);
}

// Called when the extension is deactivated.
export function deactivate() {}
