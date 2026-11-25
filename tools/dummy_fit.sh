#!/bin/bash
# test-only: squeeze CODE/vo_dummy_raw.mp3 (espeak) to exactly 59.2 s -> CODE/vo.mp3 (never for final render)
set -eu; e=$1
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $e/vo_dummy_raw.mp3)
r=$(python3 -I -c "print(f'{$d/59.2:.5f}')")
ffmpeg -v error -y -i $e/vo_dummy_raw.mp3 -af "atempo=$r,apad" -t 59.2 -ar 44100 -ac 1 -b:a 128k $e/vo.mp3
echo "$e dummy $d -> $(ffprobe -v error -show_entries format=duration -of csv=p=0 $e/vo.mp3) (x$r)"
