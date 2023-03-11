# Sketchy
```javascript
     const sketch = new Sketchy({
            data:{
                colors:['red','blue','green','yellow','orange','black','purple','cyan'],
                defaultColor:"green",
                fileName:"sketch",
                title:"hello"
            },
            events:{
                onColorClicked(){
                    console.log('onColorClicked');
                },
                onCapture(){
                    console.log('onCapture');
                }
            }
        });
        sketch.mount('body')
```
