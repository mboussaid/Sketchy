class Sketchy{
    constructor({data,events}){
        this.data = typeof data === "object" ? data : {}
        this.events = typeof events === "object" ? events : {}
        if(this.data.title){
            document.title = this.data.title;
        }
        this.addElements()
        // this.initRecorder()
        this.modes = {pen:'pen',eraser:'eraser'}
        this.mode = this.modes.pen;
    }
    addElements(){
        this.target = null;
        this.canvas = document.createElement('canvas')
        this.canvas.classList.add('sketchyCanvas')
        this.context = this.canvas.getContext('2d')
        this.onresize();
        window.addEventListener('resize',()=>{
            this.onresize();
        })
        this.context.lineWidth = 5
        this.stream = this.canvas.captureStream(30)
        this.sideBar = document.createElement('div')
        this.sideBar.classList.add('sketchySideBar')
        this.toolBar = document.createElement('div')
        this.toolBar.classList.add('sketchyToolBar')
        this.penButton = document.createElement('button');
        this.penButton.classList.add('active')
        this.eraserButton = document.createElement('button')
        this.penButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"></path></svg>`;
        this.eraserButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m2.586 15.408 4.299 4.299a.996.996 0 0 0 .707.293h12.001v-2h-6.958l7.222-7.222c.78-.779.78-2.049 0-2.828L14.906 3a2.003 2.003 0 0 0-2.828 0l-4.75 4.749-4.754 4.843a2.007 2.007 0 0 0 .012 2.816zM13.492 4.414l4.95 4.95-2.586 2.586L10.906 7l2.586-2.586zM8.749 9.156l.743-.742 4.95 4.95-4.557 4.557a1.026 1.026 0 0 0-.069.079h-1.81l-4.005-4.007 4.748-4.837z"></path></svg>`
        this.penButton.classList.add('sketchySideBarButton')
        this.eraserButton.classList.add('sketchySideBarButton')
        this.penButton.onclick = ()=>{
            this.mode = this.modes.pen;
            this.eraserButton.classList.remove('active')
            this.penButton.classList.add('active')
        }
        this.eraserButton.onclick = ()=>{
            this.mode = this.modes.eraser;
            this.penButton.classList.remove('active')
            this.eraserButton.classList.add('active')
        }
        this.sideBar.appendChild(this.penButton)
        this.sideBar.appendChild(this.eraserButton)
        this.data.colors.forEach(color=>{
            const btn = document.createElement('button')
            btn.classList.add('sketchySideBarButton')
            btn.style.backgroundColor = color;
            btn.onclick = ()=>{
                this.mode = this.modes.pen;
                this.eraserButton.classList.remove('active')
                this.penButton.classList.add('active')
                this.data.defaultColor = color;
                this.notify('onColorClicked')
            }
            this.sideBar.appendChild(btn)
        })
        // this.recordButton = document.createElement('button')
        // this.recordButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M12 5c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path><path d="M12 9c-1.627 0-3 1.373-3 3s1.373 3 3 3 3-1.373 3-3-1.373-3-3-3z"></path></svg>`
        this.captureButton = document.createElement('button')
        this.captureButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M12 9c-1.626 0-3 1.374-3 3s1.374 3 3 3 3-1.374 3-3-1.374-3-3-3z"></path><path d="M20 5h-2.586l-2.707-2.707A.996.996 0 0 0 14 2h-4a.996.996 0 0 0-.707.293L6.586 5H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-8 12c-2.71 0-5-2.29-5-5s2.29-5 5-5 5 2.29 5 5-2.29 5-5 5z"></path></svg>`
        // this.recordButton.classList.add('sketchyToolBarButton')
        this.captureButton.classList.add('sketchyToolBarButton')
        this.captureButton.onclick = ()=>{
            this.handleCapture();
        }
        // this.recordButton.onclick = ()=>{
        //     this.hanleRecord();
        // }
        // this.toolBar.appendChild(this.recordButton)
        this.toolBar.appendChild(this.captureButton)
    }
    onresize(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    initRecorder(){
        this.isRecording = false
        this.mediaRecorder = null;
        this.chunks = []
    }
    handleCanvasEvents(){
        this.context.lineWidth = 5
        this.x = null
        this.y = null
        this.isMouseDown = false
        this.canvas.addEventListener("mousedown", (e) => {
            this.isMouseDown = true
        })
        this.canvas.addEventListener("mouseup", (e) => {
            this.isMouseDown = false
        })
        this.canvas.addEventListener("mousemove", (e)=>{
            if(this.x == null || this.y == null || !this.isMouseDown){
                this.x = e.clientX
                this.y = e.clientY
                return
            }
            const newX = e.clientX;
            const newY = e.clientY;
            if(this.mode === this.modes.pen){
                this.context.strokeStyle = this.data.defaultColor ? this.data.defaultColor : this.data.colors[0];
                this.context.beginPath();
                this.context.moveTo( this.x, this.y );
                this.context.lineTo( newX, newY );
                this.context.stroke();
            }else if(this.mode === this.modes.eraser){
                this.context.clearRect(this.x,this.y,30,30)
            }
            this.x = newX;
            this.y = newY;
        })
    }
    handleCapture(){
        let a = document.createElement('a')
        a.href = this.canvas.toDataURL('image/png')
        a.download = this.data.fileName + '.png'
        a.click();
        this.notify('onCapture')
    }
    hanleRecord(){
        this.recordButton.classList.toggle('active')
        if(this.isRecording){
            this.isRecording = false;
            if(this.mediaRecorder){
                this.mediaRecorder.stop();
            }
            const blob = new Blob(this.chunks,{type:'video/webm'});
            const a = document.createElement('a')
            const href = URL.createObjectURL(blob);
            a.href = href;
            a.download = this.data.fileName +'.webm'
            a.click();
            setTimeout(()=>{
                URL.revokeObjectURL(href)
                this.chunks = []
            },100)
            this.notify('onRecordStop')
        }else{
            this.isRecording = true;
            this.stream.getVideoTracks()[0];
            this.mediaRecorder = new MediaRecorder(this.stream,{mimeType:'video/webm',ignoreMutedMedia:true})
            this.mediaRecorder.ondataavailable = ({data})=>{
                if(data.size > 0){
                    this.chunks.push(data)
                }
            }
            this.mediaRecorder.onstart = ()=>{
                console.log("...")
            }
            this.mediaRecorder.onerror = err=>{
                console.log('error')
            }
            this.mediaRecorder.start();
            this.notify('onRecordStart')
        }
    }
    notify(event){
        if(!event) return
        if(typeof this.events[event] === "function"){
            this.events[event]()
        }
    }
    mount(target){
        if(!target) return
        this.target = document.querySelector(target);
        [this.canvas,this.sideBar,this.toolBar]
        .forEach(element=>{
            this.target.appendChild(element)
        })
        this.handleCanvasEvents();
    }
}
