FROM jlesage/firefox
WORKDIR /tmp

# Copy files
COPY rootfs/ /

# Switch Alpine to Edge repository and update all packages
RUN sed -i -e 's/v[[:digit:]]\..*\//edge\//g' /etc/apk/repositories && \
    apk update && \
    apk upgrade --available

# Update Firefox to latest release
RUN latest=$(apk list firefox | tail -n 1 | cut -d " " -f 1 | sed 's/firefox-//') && \
    add-pkg firefox=$latest --force

# Patch NoVNC with custom UI
RUN cat /opt/novnc/index.vnc | sed 's/<\/head>/  <link rel="stylesheet" href="ios-ui.css" \/>\n<\/head>/' > /opt/novnc/index.vnc.patched && \
    cat /opt/novnc/index.vnc.patched | sed 's/<\/body>/  <script src="ios-ui.js"><\/script>\n<\/body>/' > /opt/novnc/index.vnc && \
    rm /opt/novnc/index.vnc.patched

# Set permissions
RUN chmod 666 /opt/novnc/messages

# Set environment variables
ENV APP_NAME="Firefox-iOS"
ENV KEEP_APP_RUNNING=1
ENV DISPLAY_WIDTH=449
ENV DISPLAY_HEIGHT=858
ENV X11VNC_EXTRA_OPTS="-nocursor"

# Set Firefox configuration
ENV FF_PREF_DISABLE_SAFEMODE="toolkit.startup.max_resumed_crashes=-1"
ENV FF_PREF_DISABLE_TAB_WARNING="browser.tabs.warnOnClose=false"
ENV FF_PREF_DISABLE_QUIT_WARNING="browser.warnOnQuit=false"
ENV FF_PREF_ENABLE_USER_CHROME="toolkit.legacyUserProfileCustomizations.stylesheets=true"
ENV FF_PREF_USER_AGENT="general.useragent.override='Mozilla/5.0 (iPhone; CPU iPhone OS 14_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'"

# Metadata
LABEL org.label-schema.name="firefox-ios"
LABEL org.label-schema.description="Docker container for Firefox iOS"
LABEL org.label-schema.version="1.0"
LABEL org.label-schema.vcs-url="https://github.com/jdgregson/docker-firefox-ios"
LABEL org.label-schema.schema-version="1.0"
