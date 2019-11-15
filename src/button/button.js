var isSwaggerPage = document.getElementById('swagger-ui') != undefined

var button, autologin, endpoint, jsonfield

// only inject the button to pages
// which contain the swagger ui
if (isSwaggerPage) {

    injectLoginButton();

    // get the saved auth credentials
    chrome.storage.sync.get('sal', function (storage) {
        autologin = storage.sal.autologin;
        endpoint = storage.sal.endpoint;
        jsonfield = storage.sal.jsonfield;

        if(autologin){
            setTimeout(function() {
                logIn();
                }, 300);
        }
    })

    // listen for changes to the auth credentials
    chrome.storage.onChanged.addListener(function (changes) {
        autologin = changes.sal.newValue.autologin;
        endpoint = changes.sal.newValue.endpoint;
        jsonfield = changes.sal.newValue.jsonfield;
    })

}

/**
 * Inject the Login button to the page.
 */
function injectLoginButton () {
    // inject the button
    var html = document.createElement('div')
    html.innerHTML = '<button id="sal-button" type="button"></button>'
    document.body.appendChild(html)

    button = document.getElementById('sal-button')
    setButtonState('ready')

    // register click handler
    button.onclick = function () {
        logIn()
    }
}

/**
 * Perform the login.
 */
function logIn () {
    setButtonState('loading')

    var xhr = new XMLHttpRequest()
    xhr.open('POST', endpoint, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // find the auth token
            var response = JSON.parse(this.responseText);
            var token = response.token;

            // auto set the auth token in the ui
            document.getElementsByClassName('authorize')[0].click();

            let input = document.getElementsByTagName('input')[0];
            
            if(!input){
                document.getElementsByClassName('btn modal-btn auth button')[0].click();
                input = document.getElementsByTagName('input')[0];
            }

            let lastValue = input.value;
            input.value = 'Bearer ' + token;
            let event = new Event('input', { bubbles: true });
            // hack React15
            event.simulated = true;
            // hack React16 
            let tracker = input._valueTracker;
            if (tracker) {
              tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);

            document.getElementsByClassName('btn modal-btn authorize')[0].click();
            document.getElementsByClassName('btn-done')[0].click();

            setButtonState('ready');
        } else if (this.readyState == 4) {
            setButtonState('error')
        }
    }

    xhr.send(jsonfield);

}

/**
 * Set the state of the button.
 *
 * @param {String} state
 */
function setButtonState (state) {
    switch (state) {
        case 'ready':
            button.classList.remove('sal-error')
            button.innerHTML = 'Log In'
            break
        case 'loading':
            button.classList.remove('sal-error')
            button.innerHTML = '<div id="sal-spinner"></div>'
            break
        case 'error':
            button.classList.add('sal-error')
            button.innerHTML = 'Try Again'
            break
    }
}
