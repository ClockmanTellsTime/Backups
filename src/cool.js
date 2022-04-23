const body = document.querySelector("body")
const head = document.querySelector("head")

var clones = 0

var data = {}

var foorLoopVars = {}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function forLoop(callback=function(){},loops=1,variable="i",after = function(){},delay = 0) {
    foorLoopVars[variable] = {
        count: 0,
    }
    for (var i = 0; i < loops; i++) {
        foorLoopVars[variable] = i
        callback()
        sleep(delay)
    }
    foorLoopVars[variable] = {
        count: 0,
    }
    after()
}

function $(selector) {
    var element =  document.querySelector(selector)

    if (data[selector] == undefined) {
        data[selector] = {
            clones: 0,
            cloned: [],
        }
    }

    const self = {
        html: ()=> element,
        on: (event, callback) => {
            element.addEventListener(event, callback)
        },
        hide: ()=> {
            element.style.display = 'none'
        },
        show: () => {
            element.style.display = 'block'
        },
        setTextColor: (color) => {
            element.style.color = color
        },
        setBackgroundColor: (color) => {
            element.style.backgroundColor = color
        },
        setFontSize: (size) => {
            element.style.fontSize = size
        },
        delete: () => {
            element.parentNode.removeChild(element)
        },
        clone: (num=1) => {
            forLoop(function(){
                var clone = element.cloneNode(true)
                if (element.id == "") {
                    clone.id = clones
                    clones += 1
                }
                else {
                    clone.id = element.id + "_clone_" + data[selector].clones
                    data[selector].clones += 1
                }
                body.appendChild(clone)
                data[selector].cloned.push(clone)
            },num)
        }
    }

    return self
}
