import "interact"

export default class Element {
  constructor(id, name, children, parent, isArray, setRelation) {
    this.id = id
    this.name = name;
    this.isArray = isArray;
    this.children = [];
    this.parent = null;
    this.position = {
      x: 0,
      y: 0
    };

    if (children) {
      this.children = children
      child.setParent(this);
    }

    if (parent) {
      this.parent = parent;
      parent.addChild(this);
      
    }

    this.setDraggable(id, this.position, this.children);
    this.setResizable(id);
    this.setDropzone(id, setRelation);
  }

  addChild(child) {
    this.children.push(child)
  }

  setParent(parent) {
    this.parent = parent;
  }

  evictChild(child) {
    const indexToRemove = this.children.findIndex(id => id == child)
    this.children.splice(indexToRemove, 1)
  }

  setDraggable(id, position, children) {
    interact("#" + id).draggable({
      listeners: {
        start(event) {
          event.target.style.zIndex = 100
        },
        move(event) {
          children.forEach((child) => {
            child.move(event.dx, event.dy);
          });
          
          position.x += event.dx;
          position.y += event.dy;

          event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
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
          })

          Object.assign(event.target.dataset, {
            x,
            y
          })
        }
      }
    })
  }

  setDropzone(id, setRelation) {
    interact("#" + id).dropzone({
        ondrop: (event) => {
            setRelation(event.target.id, event.relatedTarget.id);
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
    this.position.x += moveX;
    this.position.y += moveY;

    document.getElementById(this.id).style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    if(this.children.length == 0 || this.children == null) {
      return;
    }
    this.children.forEach((child) => {
      child.move(moveX, moveY);
    });
  }

}
