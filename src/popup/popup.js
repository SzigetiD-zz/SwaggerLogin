document.addEventListener('DOMContentLoaded', function() {
    var autologinInput = document.getElementById('autologin')
    var saveButton = document.getElementById('saveButton')
    var endpointInput = document.getElementById('endpoint')
    var JsonFieldInput = document.getElementById('JsonField')

    // preset the form with saved values
    useCredentials(function (autologin, endpoint, Jsonfield) {
        autologinInput.checked = autologin
        endpointInput.value = endpoint
        JsonFieldInput.value = Jsonfield
    })

    registerEventHandlers()

    /**
     * Register the event handlers.
     *
     * @return {void}
     */
    function registerEventHandlers () {
        saveButton.onclick = function () {
            chrome.storage.sync.set({
                sal: {
                    autologin: autologinInput.checked,
                    endpoint: endpointInput.value,
                    jsonfield: JsonFieldInput.value
                }
            })

            window.close()
        }
    }

    /**
     * Use the existing credentials and perform an action with them.
     *
     * @param  {Function} callback
     * @return {void}
     */
    function useCredentials (callback) {
        chrome.storage.sync.get('sal', function (storage) {
            if (storage.sal) {
                callback(storage.sal.autologin, storage.sal.endpoint, storage.sal.jsonfield)
            }
        })
    }
})

