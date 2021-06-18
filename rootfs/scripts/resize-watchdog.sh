#!/usr/bin/with-contenv sh

last_set=""
while true; do
    last=$(tail -n 100 /config/log/nginx/access.log | grep -Eoh "resize=\d{3,4},\d{3,4}" | tail -n 1)
    if [ ! -z "$last" ] && [ "$last" != "$last_set" ]; then
        last_set=$last
        width=$(echo $last | cut -d "=" -f 2 | cut -d "," -f 1)
        height=$(echo $last | cut -d "," -f 2)
        echo "$width" > /config/display_width
        echo "$height" > /config/display_height
        pkill -3 Xvfb
    fi
    sleep 1
done