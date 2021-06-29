const apiPort = '5801';
const apiServer =
    `${document.location.protocol}//${document.location.hostname}:${apiPort}`;

const addButton = (icon, cssClass, target, callback) => {
  const opener = document.createElement('div');
  opener.innerHTML = `
    <li class="ios-btn ${cssClass}">
      <button class="btn btn-default navbar-btn">
        <i aria-hidden="true" class="fa ${icon} fa-fw"></i>
      </button>
    </li>`;
  const button = opener.children[0];
  (button.querySelector('button')).addEventListener('click', callback);
  target.appendChild(button);
};

/*
 * When in split-screen mode, T=the iPad returns the size of the whole screen
 * rather than the size of the split-screen'd app. We can get the size of the
 * `documentElement` instead, which is accurate for all devices in all
 * orientations.
 */
const getScreenSize = () => {
  const rect = document.documentElement.getBoundingClientRect();
  return [rect.width, rect.height];
};

const rand = () => {
  return (''+Math.random()).split('.')[1];
};

const fitToScreen = () => {
  let w, h;
  [w, h] = getScreenSize();
  h = h - 51;
  const xhr = new XMLHttpRequest();
  xhr.open('GET',
      `${apiServer}/set-display-size/?w=${w}&h=${h}&cachebuster=${rand()}`);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      if (this.status === 200) {
        document.location.reload();
      } else {
        alert(response.message);
      }
    }
  }
  xhr.send();
};

const showMenu = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${apiServer}/get-user-agents/?cachebuster=${rand()}`);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      if (this.status === 200) {
        const userAgents = response.message.userAgents;
        const activeUserAgent = response.message.active;
        const userAgentSelect = document.getElementById('user-agent-select');
        userAgentSelect.innerHTML = '';
        userAgents.forEach((userAgent, i) => {
          const userAgentOption = document.createElement('option');
          userAgentOption.value = userAgent.id;
          userAgentOption.innerText = userAgent.name;
          userAgentSelect.appendChild(userAgentOption);
          if (userAgent.id == activeUserAgent) {
            userAgentSelect.value = activeUserAgent;
            window.activeUserAgent = activeUserAgent;
          }
        });
        $('#menuModal').modal('show');
      } else {
        alert(response.message);
      }
    }
  }
  xhr.send();
};

// Bind buttons and inputs

// User agent input
const userAgentSelect = document.getElementById('user-agent-select');
if (userAgentSelect) {
  userAgentSelect.addEventListener('change', function() {
    if (this.value) {
      window.selectedUserAgent = this.value;
    }
  });
}

// Cancel options button
const cancelOptionsButton = document.getElementById('cancel-options-button');
if (cancelOptionsButton) {
  cancelOptionsButton.addEventListener('click', function() {
    $('#menuModal').modal('hide');
  });
}

// Submit options button
const submitOptionsButton = document.getElementById('submit-options-button');
if (submitOptionsButton) {
  submitOptionsButton.addEventListener('click', function() {

    // Set user agent
    if (typeof window.selectedUserAgent !== 'undefined' ) {
      if (typeof window.activeUserAgent === 'undefined' ||
          window.activeUserAgent != window.selectedUserAgent) {
        const id = window.selectedUserAgent;
        const xhr = new XMLHttpRequest();
        xhr.open('GET',
            `${apiServer}/set-user-agent/?id=${id}&cachebuster=${rand()}`);
        xhr.send();
      }
    }

    $('#menuModal').modal('hide');
  });
}

// Replace the navbar
const navbar = document.querySelector('.navbar');
const iosNavbar = document.createElement('div');
iosNavbar.id = 'ios-navbar';
if (navbar) {
  navbar.appendChild(iosNavbar);

  // Menu button
  const menuButtonArea = document.createElement('div');
  menuButtonArea.id = 'menu-button-area';
  menuButtonArea.innerHTML =
      '<i class="fa fa-ellipsis-v" aria-hidden="true"></i>';
  iosNavbar.appendChild(menuButtonArea);
  menuButtonArea.addEventListener('click', () => {
    showMenu();
  });

  // Keyboard button
  addButton('fa-keyboard-o', '', iosNavbar, () => {
    document.getElementById('virtualKeyboardToggleButton').click();
  });

  // Cliboard button
  addButton('fa-clipboard', '', iosNavbar, () => {;
    document.getElementById('clipboardModalButton').click();
  });

  // Message indicator
  const messageArea = document.createElement('div');
  messageArea.classList.add('message-area');
  messageArea.innerHTML = '<span class="message"></span>';
  iosNavbar.appendChild(messageArea);

  // Refresh button
  addButton('fa-refresh', 'right', iosNavbar, () => {
    document.location.reload();
  });

  // Resize button
  addButton('fa-arrows-alt', 'right', iosNavbar, () => {
    fitToScreen();
  });

  // Viewers indicator
  const viewersIndicatorArea = document.createElement('div');
  viewersIndicatorArea.id = 'viewers-indicator-area';
  viewersIndicatorArea.innerHTML =
      '<i class="fa fa-eye" aria-hidden="true"></i><br>' +
      '<span id="viewers-count">?</span>';
  iosNavbar.appendChild(viewersIndicatorArea);
}

// Update viewers indicator
window.viewersTimer = self.setInterval(() => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${apiServer}/get-viewers/?cachebuster=${rand()}`);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      const indicatorArea = document.getElementById('viewers-indicator-area');
      const indicatorCount = document.getElementById('viewers-count');
      indicatorArea.classList.add('blink');
      let color = '#ff2e2e';
      let count = '?'
      if (this.status === 200) {
        const response = JSON.parse(this.response);
        if (response.message == parseInt(response.message)) {
          count = parseInt(response.message);
          if (count === 1) {
            color = '#16e6e4';
            indicatorArea.classList.remove('blink');
          } else {
            color = 'orange';
          }
        }
      }
      indicatorArea.style.color = color;
      indicatorCount.innerText = count;
    }
  }
  xhr.send();
}, 3000);

// Update message indicator
window.viewersTimer = self.setInterval(() => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${apiServer}/get-messages/?cachebuster=${rand()}`);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        const response = JSON.parse(this.response);
        const messageArea = document.querySelector('.message-area .message');
        messageArea.innerText = response.message;
      }
    }
  }
  xhr.send();
}, 10000);