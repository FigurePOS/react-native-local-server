#!/bin/sh

echo "Releasing SDK"

VERSION=$(cat "./package.json" | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')

if [ -z "$VERSION" ]; then
  echo "Failed to get version from package.json."
  echo "version: $VERSION"
  exit 1
fi

LAST_TAG="v$VERSION"

echo "Comparing files with the latest tag: $LAST_TAG"

CHANGED_FILES="$(git diff --name-only "$LAST_TAG" "HEAD")"

ANDROID_FILES="$(echo  "$CHANGED_FILES" | grep "^android/src/main/java")"
IOS_FILES="$(echo  "$CHANGED_FILES" | grep "^ios/")"

if [ -z "$ANDROID_FILES" ] && [ -z "$IOS_FILES" ]; then
  echo "No native files changed, releasing TS version only."
  yarn release:ts --ci
else
  echo "Native files changed, releasing new NATIVE version."
  yarn release:native --ci
fi
