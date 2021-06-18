#!/usr/bin/with-contenv sh

while true; do
    if [ -z "$(ps | grep Xvfb | grep -v grep)" ]; then
        w=$DISPLAY_WIDTH
        if [ -f "/config/display_width" ]; then
            w=$(cat /config/display_width)
        fi
        h=$DISPLAY_HEIGHT
        if [ -f "/config/display_height" ]; then
            h=$(cat /config/display_height)
        fi
        /usr/bin/Xvfb :0 -screen 0 ${w}x${h}x24
    fi
    sleep 1
done