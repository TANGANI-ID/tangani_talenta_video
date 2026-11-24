#!/bin/bash
# usage: K1=... K2=... [K3=...] tts.sh CODE   (run from project root) -> CODE/vo_raw.mp3 then fit to CODE/vo.mp3
# tries K1, falls back to K2 when K1 is out of credits/unauthorized; retries on 429.
set -u; e=$1
for key in "$K1" "${K2:-}" "${K3:-}"; do [ -z "$key" ] && continue
  for try in 1 2 3 4 5 6; do
    code=$(curl -s -o $e/vo_raw.mp3 -w '%{http_code}' -X POST "https://api.elevenlabs.io/v1/text-to-speech/RbNgJzKAV7jpYJNtCBpj?output_format=mp3_44100_128" -H "xi-api-key: $key" -H "Content-Type: application/json" --data-binary @$e/.tts.json)
    if [ "$code" = 200 ]; then printf "$e: "; python3 -I engine/fit_vo.py $e/vo_raw.mp3 $e/vo.mp3; exit $?; fi
    msg=$(head -c 300 $e/vo_raw.mp3); rm -f $e/vo_raw.mp3
    if [ "$code" = 429 ] || echo "$msg" | grep -q "concurrent"; then sleep $((try * 8)); continue; fi
    echo "$e key gagal $code: $msg" >&2; break
  done
done
exit 1
