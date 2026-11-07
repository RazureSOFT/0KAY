package version

// What version is this build?
//
// Two answers, and the difference matters:
//
//   - A released build was cut from a tag. The tag IS the version, so the
//     release pipeline passes it in and nothing else can disagree with it.
//   - A local build came from a commit that nobody tagged. Pretending it is
//     "0.1.4" makes every bug report ambiguous: the number says release, the
//     code says maybe-not. So a local build reports its commit.
//
// The fallbacks below are ordered by how much they can be trusted. The link
// -X values from the build script win; git is asked next; a plain string is
// the last resort for a tarball with no git history at all.

import (
	"os/exec"
	"strings"
	"sync"
)

// Set by the build: -X 0kay/core/internal/version.Tag=v0.1.4
var Tag = ""

// Set by the build: -X 0kay/core/internal/version.Commit=e646868
var Commit = ""

// Set by the build when the working tree was dirty at build time.
var Dirty = ""

// Version is the last resort: an unpacked tree with no git metadata.
const Version = "0.1.4"

var (
	once      sync.Once
	resolved  string
	resolvedK string
)

func compute() {
	if tag := normalizeTag(Tag); tag != "" {
		resolved, resolvedK = tag, "tag"
		return
	}
	commit := strings.TrimSpace(Commit)
	if commit == "" {
		commit = git("rev-parse", "--short=7", "HEAD")
	}
	if commit != "" {
		label := commit
		if Dirty == "1" || (Commit == "" && git("status", "--porcelain") != "") {
			label += "-dirty"
		}
		resolved, resolvedK = label, "commit"
		return
	}
	resolved, resolvedK = Version, "fallback"
}

func normalizeTag(value string) string {
	tag := strings.TrimSpace(value)
	tag = strings.TrimPrefix(tag, "refs/tags/")
	if tag == "" || tag == "unknown" {
		return ""
	}
	return tag
}

func git(args ...string) string {
	out, err := exec.Command("git", args...).Output()
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(out))
}

// String is what /health, the plugin hello and the UI show.
func String() string {
	once.Do(compute)
	return resolved
}

// Source says where the string came from: tag, commit, or fallback. The UI uses
// it to label a local build instead of implying it is a release.
func Source() string {
	once.Do(compute)
	return resolvedK
}

// IsRelease is true only for a build cut from a tag.
func IsRelease() bool {
	return Source() == "tag"
}

// Semver is the number to compare against a release feed.
//
// String() can be a commit, which no release comparison can order. Update
// checks need a version, so they use this: the tag when there is one, and the
// last release this code was known good against when there is not.
func Semver() string {
	if tag := normalizeTag(Tag); tag != "" {
		return tag
	}
	return Version
}
