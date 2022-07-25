#!/bin/sh

dirname="$(dirname ${BASH_SOURCE[0]})"
version=$(cat "$dirname/../package.json" | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')

LAST_TAG="v$version"

CHANGED_FILES="$(git diff --name-only "$LAST_TAG" "HEAD")"

ANDROID_FILES="$(echo  "$CHANGED_FILES" | grep "^android/src/main/java")"
IOS_FILES="$(echo  "$CHANGED_FILES" | grep "^ios/")"

if [ -z "$ANDROID_FILES" ] && [ -z "$IOS_FILES" ]; then
  yarn release:ts
else
  yarn release:native
fi
