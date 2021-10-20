//📌
import izitoast from 'izitoast'

function message(action, settings, fn) {
    let obj = {
        position: settings.position || 'topRight'
    }
    if (fn) {
        obj.onClosing = function () {
            fn()
        }
    }
    // position: 'center', bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
    for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
            obj[key] = settings[key];
        }
    }
    izitoast[action](obj)
}

export default message