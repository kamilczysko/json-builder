export function setDraggable(id, position, children) {
    interact("#" + id).draggable({
        listeners: {
            start(event) {
                event.target.style.zIndex = 10000000
            },
            move(event) {
                position.x += event.dx;
                position.y += event.dy;

                event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;

                if (children) {
                    children.forEach((child) => {
                        child.move(event.dx, event.dy);
                    });
                }
            },
            end(event) {
            }
        },
        modifiers: [
            interact.modifiers.snap({
                targets: [
                    interact.snappers.grid({
                        x: 10,
                        y: 10
                    })
                ],
                range: Infinity,
                relativePoints: [{
                    x: 0,
                    y: 0
                }]
            }),
            interact.modifiers.restrict({
                // restriction: element.parentNode,
                elementRect: {
                    top: 0,
                    left: 0,
                    bottom: 1,
                    right: 1
                },
                endOnly: true
            })
        ],
        inertia: true
    })
}

export function setResizable(id) {
    interact("#" + id).resizable({
        edges: {
            top: false,
            left: false,
            bottom: true,
            right: true
        },
        listeners: {
            move: function (event) {
                let {
                    x,
                    y
                } = event.target.dataset

                x = (parseFloat(x) || 0) + event.deltaRect.left
                y = (parseFloat(y) || 0) + event.deltaRect.top

                if (event.rect.width < 50 || event.rect.height < 50) {
                    return
                }

                Object.assign(event.target.style, {
                    width: `${event.rect.width}px`,
                    height: `${event.rect.height}px`,
                })

                Object.assign(event.target.dataset, {
                    x,
                    y
                })
            }
        }
    })
}

export function setDropzone(id, assignChild) {
    interact("#" + id).dropzone({
        ondrop: (event) => {
            assignChild(event.relatedTarget.id);

            let dropzoneElement = document.getElementById(id + "-drop");
            dropzoneElement.classList.remove('above')
        },
        ondragenter: function (event) {
            let dropzoneElement = document.getElementById(id + "-drop");
            dropzoneElement.classList.add('above')

        },
        ondragleave: function (event) {
            let dropzoneElement = document.getElementById(id + "-drop");
            dropzoneElement.classList.remove('above')
        },
    })


    interact("#" + id).on('tap', function (event) {
        event.preventDefault()
    })
}