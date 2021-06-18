var canvas = new fabric.Canvas("pdfcanvas"),
  pageNum = 1,
  pdfDoc = null,
  pageRendering = false,
  file = null,
  defaultOpacity = 0.5;

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

        // viewport = pagina
        var viewport = page.getViewport(1.0);
        var canvasEl = document.querySelector("canvas")
        canvasEl.height = viewport.height;
        canvasEl.width = viewport.width;

        page.render({
          canvasContext: canvasEl.getContext('2d'),
          viewport: viewport
        }).then(function () {

          var bg = canvasEl.toDataURL("image/png");

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

function add() {
  var rect = new fabric.Rect({
    left: 100,
    top: 50,
    fill: 'lightgreen',
    width: 200,
    height: 100,
    objectCaching: false,
    stroke: 'lightgreen',
    strokeWidth: 4,
    opacity: defaultOpacity,
    hasRotatingPoint: false
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
}

function loadLayout() {
  var mockRect = new fabric.Rect({
    left: 22.124278247413486,
    top: 60.03227110270158,
    fill: 'lightgreen',
    width: 338.79767473300996,
    height: 40.34097469859059,
    objectCaching: false,
    stroke: 'lightgreen',
    strokeWidth: 4,
    opacity: defaultOpacity,
    hasRotatingPoint: false
  });

  canvas.add(mockRect);

  mockRect = new fabric.Rect({
    left: 381.1896039928488,
    top: 264.81074266792814,
    fill: 'lightgreen',
    width: 169.81407191236798,
    height: 90.71267824115502,
    objectCaching: false,
    stroke: 'lightgreen',
    strokeWidth: 4,
    opacity: defaultOpacity,
    hasRotatingPoint: false
  });

  canvas.add(mockRect);

  mockRect = new fabric.Rect({
    left: 27.75363603880217,
    top: 547.2733985073057,
    fill: 'lightgreen',
    width: 337.9218674612645,
    height: 116.86460980848406,
    objectCaching: false,
    stroke: 'lightgreen',
    strokeWidth: 4,
    opacity: defaultOpacity,
    hasRotatingPoint: false
  });

  canvas.add(mockRect);
}