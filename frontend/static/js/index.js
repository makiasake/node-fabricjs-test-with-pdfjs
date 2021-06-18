var canvas = new fabric.Canvas("pdfcanvas");

document.querySelector("#pdf-upload").addEventListener("change", function(e) {
    var file = e.target.files[0]
    
    if (file.type != "application/pdf") {
      console.error(file.name, " arquivo não é pdf")
      return
    }
  
    var fileReader = new FileReader();
  
    fileReader.onload = function() {
      var typedarray = new Uint8Array(this.result);
  
      PDFJS.getDocument(typedarray).then(function(pdf) {
        // you can now use *pdf* here
        console.log("PDF com:  ", pdf.numPages, "paginas.")
        pdf.getPage(1).then(function(page) {
          // you can now use *page* here
          var viewport = page.getViewport(1.0);
          var canvasEl = document.querySelector("canvas")
          canvasEl.height = viewport.height;
          canvasEl.width = viewport.width;
  
          page.render({
            canvasContext: canvasEl.getContext('2d'),
            viewport: viewport
          }).then(function() {
  
            var bg = canvasEl.toDataURL("image/png");

            var rect = new fabric.Rect({
                left: 100,
                top: 50,
                fill: 'lightgreen',
                width: 200,
                height: 100,
                objectCaching: false,
                stroke: 'lightgreen',
                strokeWidth: 4,
                opacity: 0.2
              });
            
            canvas.add(rect);
            canvas.setActiveObject(rect);

            fabric.Image.fromURL(bg, function(img) {
              img.scaleToHeight(viewport.height);
              canvas.setHeight(viewport.height);
              canvas.setWidth(viewport.width);
              canvas.setBackgroundImage(img);
            });
            canvas.renderAll();
          });
        });
  
      });
    };
    fileReader.readAsArrayBuffer(file);
  });

function checkPosition(){
    var obj = canvas.getActiveObject();
    alert("left: " + obj.left + ", top: " + obj.top + ", height: " + obj.height * obj.scaleY + ", width: " + obj.width * obj.scaleX);
}