import React, { Component } from 'react';
import { Button } from 'antd';
import Dropzone from 'react-dropzone'
import './App.css';

class App extends Component {

  image = {};
  canvas = {}

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
  }

  onDrop(acceptedFiles) {
    this.handleFiles(acceptedFiles);
  }

  handleFiles(files) {
    let file = files[0];
    let reader = new FileReader();
    reader.onload = (event) => this.processImage(event);
    reader.readAsArrayBuffer(file);
  }

  processImage(e) {
    let buffer = e.target.result;
    let bitmap = this.getBMP(buffer);
    this.image = this.convertToImageData(bitmap, this.canvas);
    this.renderImage(this.canvas);
  }

  renderImage() {
    let ctx = this.canvas.getContext('2d');
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    ctx.putImageData(this.image, 0, 0);
  }

  convertToImageData(bitmap) {
    let ctx = this.canvas.getContext('2d');
    var Width = bitmap.infoheader.biWidth;
    var Height = bitmap.infoheader.biHeight;
    var imageData = ctx.createImageData(Width, Height);
    var data = imageData.data;
    var bmpdata = bitmap.pixels;
    var stride = bitmap.stride;
    for (var y = 0; y < Height; ++y) {
      for (var x = 0; x < Width; ++x) {
        var index1 = (x + Width * (Height - y)) * 4;
        var index2 = x * 3 + stride * y;
        data[index1] = bmpdata[index2 + 2];
        data[index1 + 1] = bmpdata[index2 + 1];
        data[index1 + 2] = bmpdata[index2];
        data[index1 + 3] = 255;
      }
    }
    return imageData;
  }

  getBMP(buffer) {
    let datav = new DataView(buffer);
    let bitmap = {};
    bitmap.fileheader = {};
    bitmap.fileheader.bfType = datav.getUint16(0, true);
    bitmap.fileheader.bfSize = datav.getUint32(2, true);
    bitmap.fileheader.bfReserved1 = datav.getUint16(6, true);
    bitmap.fileheader.bfReserved2 = datav.getUint16(8, true);
    bitmap.fileheader.bfOffBits = datav.getUint32(10, true);
    bitmap.infoheader = {};
    bitmap.infoheader.biSize = datav.getUint32(14, true);
    bitmap.infoheader.biWidth = datav.getUint32(18, true);
    bitmap.infoheader.biHeight = datav.getUint32(22, true);
    bitmap.infoheader.biPlanes = datav.getUint16(26, true);
    bitmap.infoheader.biBitCount = datav.getUint16(28, true);
    bitmap.infoheader.biCompression = datav.getUint32(30, true);
    bitmap.infoheader.biSizeImage = datav.getUint32(34, true);
    bitmap.infoheader.biXPelsPerMeter = datav.getUint32(38, true);
    bitmap.infoheader.biYPelsPerMeter = datav.getUint32(42, true);
    bitmap.infoheader.biClrUsed = datav.getUint32(46, true);
    bitmap.infoheader.biClrImportant = datav.getUint32(50, true);
    let start = bitmap.fileheader.bfOffBits; bitmap.stride = Math.floor((bitmap.infoheader.biBitCount * bitmap.infoheader.biWidth + 31) / 32) * 4;
    bitmap.pixels = new Uint8Array(buffer, start);
    return bitmap;
  }

  applyFilter() {
    for (var i = 0; i < this.image.data.length; i += 3) {
      let cor = (this.image.data[i] + this.image.data[i + 1] + this.image.data[i + 2]) / 3;
      this.image.data[i] = cor;
      this.image.data[i + 1] = cor;
      this.image.data[i + 2] = cor;
    }
    this.renderImage();
  }

  render() {
    return (
      <div className="App">
        <h2>Bitmap converter</h2>
        <Dropzone className="Dropzone" onDrop={(accepted) => this.onDrop(accepted)} />
        <Button type="primary" onClick={() => this.applyFilter()}>Teste</Button>
        <canvas id="canvas"></canvas>
      </div>
    );
  }
}

export default App;
