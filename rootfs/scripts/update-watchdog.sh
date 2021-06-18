#!/usr/bin/with-contenv sh

while true; do
    sleep 600
    apk update
    latest=$(apk list firefox | grep -v "installed" | tail -n 1)
    running=$(cat /tmp/firefox_version | cut -d " " -f 3)
    if [ ! -z "$latest" ]; then
        latest_app=$(echo $latest | cut -d "-" -f 2 | cut -d " " -f 1)
        latest_package=$(echo $latest | cut -d " " -f 1 | sed 's/firefox-//')
        if [ "$latest_app" != "$running" ]; then
            apk upgrade --available
            add-pkg firefox=$latest_package --force
            echo "Close all tabs to update Firefox" > /opt/novnc/messages
        fi
    fi
done