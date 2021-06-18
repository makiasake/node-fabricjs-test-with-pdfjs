var canvas = new fabric.Canvas("pdfcanvas"),
  pageNum = 1,
  pdfDoc = null,
  pageRendering = false,
  file = null,
  rectExists = false;

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

document.querySelector("#pdf-upload").addEventListener("change", function (e) {
  renderPage(pageNum, e);
});

function renderPage(num, e) {

  if (e) {
    file = e.target.files[0]

    if (file.type != "application/pdf") {
      console.error(file.name, " arquivo não é pdf")
      return
    }
  }

  var fileReader = new FileReader();

  fileReader.onload = function () {
    var typedarray = new Uint8Array(this.result);

    PDFJS.getDocument(typedarray).then(function (pdf) {

      pdfDoc = pdf;

      pdf.getPage(num).then(function (page) {
        // you can now use *page* here
        var viewport = page.getViewport(1.0);
        var canvasEl = document.querySelector("canvas")
        canvasEl.height = viewport.height;
        canvasEl.width = viewport.width;

        page.render({
          canvasContext: canvasEl.getContext('2d'),
          viewport: viewport
        }).then(function () {

          var bg = canvasEl.toDataURL("image/png");
          
          if (!rectExists) {
            canvas.add(rect);
            canvas.setActiveObject(rect);
            rectExists = true;
          }
          
          fabric.Image.fromURL(bg, function (img) {
            img.scaleToHeight(viewport.height);
            canvas.setHeight(viewport.height);
            canvas.setWidth(viewport.width);
            canvas.setBackgroundImage(img);
          });
        });
        document.getElementById('page_num').textContent = num;
      });
      document.getElementById('page_count').textContent = pdfDoc.numPages;
    });
  };
  fileReader.readAsArrayBuffer(file);
  canvas.renderAll();
}

function checkPosition() {
  var obj = canvas.getActiveObject();
  alert("left: " + obj.left + 
        "\ntop: " + obj.top + 
        "\nheight: " + obj.height * obj.scaleY + 
        "\nwidth: " + obj.width * obj.scaleX);
  console.log("left: " + obj.left + ", top: " + obj.top + ", height: " + obj.height * obj.scaleY + ", width: " + obj.width * obj.scaleX);
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);