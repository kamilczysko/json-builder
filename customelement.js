import "interact"
export default class CustomElement {
  constructor(elementId, children, appendChild) {
    this.position = {
      x: 0,
      y: 0
    };
    this.children = children;
    this.setDraggable(elementId, this.position, children);
    this.setResizable(elementId);
    this.setDropzone(elementId, children, appendChild);
  }

  setDraggable(id, position, children) {
    interact("#" + id).draggable({
      listeners: {
        start(event) {
          event.target.style.zIndex = 100
        },
        move(event) {

          // children.forEach((child) => {
          //   const childItem = document.getElementById(child);
          //   const newX = childItem.offsetLeft + event.dx;
          //   const newY = childItem.offsetTop + event.dy;
          //   childItem.style.top = `${newY}px`;
          //   childItem.style.left = `${newX}px`;
          // });

          children.forEach((child) => {
            child.move(event.dx, event.dy);
          });

          position.x += event.dx;
          position.y += event.dy;

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`;
        },
        end(event) {
          event.target.style.zIndex = 0
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

  setResizable(id) {
    interact("#" + id).resizable({
      edges: {
        top: false,
        left: false,
        bottom: true,
        right: true
      },
      listeners: {
        move: function(event) {
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
            // transform: `translate(${x}px, ${y}px)`
          })

          Object.assign(event.target.dataset, {
            x,
            y
          })
        }
      }
    })
  }

  setDropzone(id, children, appendChild) {
    interact("#" + id).dropzone({
        ondrop: (event) => {
          console.log(event.relatedTarget.id +
            ' was dropped into ' +
            event.target.id)
          children.push(event.relatedTarget.id);
          appendChild.apply();
          console.log(children)

        }
      })
      .on('dropactivate', function(event) {
        event.target.classList.add('drop-activated')
      })

    interact("#" + id).on('tap', function(event) {
      event.currentTarget.style.color = 'red'
      event.preventDefault()
    })
  }

  move(moveX, moveY) {
    position.x += moveX;
    position.y += moveY;

    event.target.style.transform =
      `translate(${position.x}px, ${position.y}px)`;

    this.children.forEach((child) => {
      child.move(event.dx, event.dy);
    });
  }
}
