#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <PR_NUMBER>"
  exit 1
fi

pullRequestNumber=$1
rawData=$(gh pr view $pullRequestNumber --json additions,deletions,labels --template '{{.additions }} {{.deletions }} {{.labels}}')

read -a rawData <<< $rawData

additions=${rawData[0]}
deletions=${rawData[1]}
pullRequestSize=$(((additions + deletions) / 2))

labels=${rawData[@]:2}
current_size_label=""

if [ "$labels" != "[]" ]; then
  current_size_label=$(echo $labels | grep -o 'Size: [^] ]*')
fi

if [ $pullRequestSize -lt 25 ]; then
  expected_label='Size: Small'
elif [ $pullRequestSize -lt 100 ]; then
  expected_label='Size: Medium'
else
  expected_label='Size: Large'
fi

if [ "$current_size_label" != "$expected_label" ]; then
  gh pr edit $pullRequestNumber --remove-label 'Size: Small','Size: Medium','Size: Large' --add-label "$expected_label" > /dev/null
fi
