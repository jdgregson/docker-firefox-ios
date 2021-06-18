
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

const addStylesheet = (css) => {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
};

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
  xhr.open('GET', `/?resize=${w},${h}&cachebuster=${rand()}`);
  xhr.timeout = 1000;
  xhr.send();
  self.setTimeout(() => {
    document.location.reload();
  }, 3000);
};

// Replace the navbar
const navbar = document.querySelector('.navbar');
const iosNavbar = document.createElement('div');
iosNavbar.id = 'ios-navbar';
if (navbar) {
  navbar.appendChild(iosNavbar);
  addButton('fa-keyboard-o', '', iosNavbar, () => {
    document.getElementById('virtualKeyboardToggleButton').click();
  });
  addButton('fa-clipboard', '', iosNavbar, () => {;
    document.getElementById('clipboardModalButton').click();
  });
  const messageArea = document.createElement('div');
  messageArea.classList.add('message-area');
  messageArea.innerHTML = '<span class="message"></span>';
  iosNavbar.appendChild(messageArea);
  addButton('fa-refresh', 'right', iosNavbar, () => {
    document.location.reload();
  });
  addButton('fa-arrows-alt', 'right', iosNavbar, () => {
    fitToScreen();
  });
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
  xhr.open('GET', `/viewers?&cachebuster=${rand()}`);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      const indicatorArea = document.getElementById('viewers-indicator-area');
      const indicatorCount = document.getElementById('viewers-count');
      indicatorArea.classList.add('blink');
      let color = '#ff2e2e';
      let count = '?'
      if (this.status === 200) {
        if (this.response == parseInt(this.response)) {
          count = parseInt(this.response);
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

// Update message area
window.viewersTimer = self.setInterval(() => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/messages?&cachebuster=${rand()}`);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        const messageArea = document.querySelector('.message-area .message');
        messageArea.innerText = this.response;
      }
    }
  }
  xhr.send();
}, 10000);