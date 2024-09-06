#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <PR_NUMBER>"
  exit 1
fi

pullRequestNumber=$1
rawData=$(gh pr view $pullRequestNumber --json additions,deletions --template '{{.additions }} {{.deletions }}')

read -a rawData <<< $rawData

additions=${rawData[0]}
deletions=${rawData[1]}
pullRequestSize=$(((additions + deletions) / 2))

if [ $pullRequestSize -lt 25 ]; then
  gh pr edit $pullRequestNumber --remove-label 'Size: Small','Size: Medium','Size: Large' --add-label 'Size: Small' > /dev/null
elif [ $pullRequestSize -lt 100 ]; then
  gh pr edit $pullRequestNumber --remove-label 'Size: Small','Size: Medium','Size: Large' --add-label 'Size: Medium' > /dev/null
else
  gh pr edit $pullRequestNumber --remove-label 'Size: Small','Size: Medium','Size: Large' --add-label 'Size: Large' > /dev/null
fi
