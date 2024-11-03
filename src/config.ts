import path from "path";
import * as vscode from "vscode";

const CONFIG_DEFAULTS = {
  domain: "searchfox.org",
  repository: "mozilla-central",
  useHttps: true,
  nestedRepositories: {},
};

/**
 * The user's configuration for the extension.
 *
 * Reads from the provided `WorkspaceConfiguration` and substitutes unset
 * properties with the matching values from `CONFIG_DEFAULTS`.
 */
export class Config {
  #cfg: vscode.WorkspaceConfiguration;
  #rootPath: string;

  constructor(cfg: vscode.WorkspaceConfiguration, rootFolderPath: string) {
    this.#cfg = cfg;
    this.#rootPath = rootFolderPath;
  }

  /**
   * The domain for the Searchfox instance to use.
   */
  get domain(): string {
    return this.#cfg.get("domain", CONFIG_DEFAULTS.domain);
  }

  /**
   * The protocol scheme to use in URLs.
   *
   * Either "http" or "https".
   */
  get protocol(): string {
    const useHttps = this.#cfg.get("useHttps", CONFIG_DEFAULTS.useHttps);
    return useHttps ? "https" : "http";
  }

  /**
   * Looks up the repository to use for the current file, as well as its
   * relative path to use in Searchfox URLs.
   *
   * If the file is in a subdirectory listed in the `nestedRepositories`
   * setting, the matching repository is used. Otherwise the value from the
   * `repository` setting is used.
   *
   * @param filePath {string} - The absolute path to the file currently open.
   * @returns {[string, string]} - The repository to use, and the relative file
   *  path to use in URLs.
   */
  repositoryAndRelativePathForFile(filePath: string): [string, string] {
    let rootPath = this.#rootPath;
    let repository = this.#cfg.get("repository", CONFIG_DEFAULTS.repository);
    let nestedRepositories: { [key: string]: string } = this.#cfg.get(
      "nestedRepositories",
      CONFIG_DEFAULTS.nestedRepositories
    );

    // Iterate over the configured nested repositories and capture the first one
    // that applies to the current file.
    for (let key in nestedRepositories) {
      let fullSubDirPath = path.join(this.#rootPath, key);

      // Always prefer the most precise match.
      if (
        filePath.startsWith(fullSubDirPath) &&
        fullSubDirPath.length > rootPath.length
      ) {
        rootPath = fullSubDirPath;
        repository = nestedRepositories[key];
      }
    }

    const relativeFilePath = filePath.replace(rootPath, "");
    return [repository, relativeFilePath];
  }
}
