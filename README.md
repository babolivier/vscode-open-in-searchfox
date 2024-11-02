# Open in Searchfox

A simple VS Code extension to view Mozilla code in Searchfox.

To use this extension, simply navigate to the file and line to open, then
right-click and select "Open in Searchfox". This will open Searchfox on the
current file and line(s) in the default web browser.

At the moment, Searchfox always open on the latest version of the selected file
and line(s), that it knows of, because there is currently no way (that I know
of) to map Mercurial commits to the commits used in Searchfox's URLs.

## Configuration

This extension features a few configuration settings (which are accessible via
the VS Code settings UI):

* `open-in-searchfox.repository` (defaults to `"mozilla-central"`): The
  main/default repository to use.
* `open-in-searchfox.nested-repositories` (defaults to `{}`): An optional
  mapping between a sub-directory name and a repository.

For example, here is how one can use this extension with
[`mozilla-central`](https://hg.mozilla.org/mozilla-central) open, and
[`comm-central`](https://hg.mozilla.org/comm-central) cloned as a `comm`
sub-directory:

```json
{
    "open-in-searchfox": {
        "repository": "mozilla-central",
        "nested-repositories": {
            "comm": "comm-central"
        }
    }
}
```

Note that the `repository` key is redundant in this case (since it already
defaults to `"mozilla-central"`) but is included for the sake of the example.

This extension also features settings to help with the use of alternate or local
instances of Searchfox:

* `open-in-searchfox.domain` (defaults to `"searchfox.org"`): The domain of the
  Searchfox instance to use.
* `open-in-searchfox.use-https` (defaults to `true`): Whether to use HTTPS in
  requests. This setting should only be disabled for local instances.
