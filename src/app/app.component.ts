import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'John Horton Conway\'s Game of Life';
  author = 'Prabhu Raja';

  constructor() {}

  canvas: any;
  cells: any = [];
  ctx: any;

  ngOnInit() {
    this.canvas = <HTMLCanvasElement> document.getElementById('c');
    this.ctx = this.canvas.getContext("2d");

    this.init();
  }

  init() {
      this.ctx.strokeStyle = '#DADADA';
      this.ctx.fillStyle = '#FA6400';
      var self = this;

      for (var i=0; i<100; i++) {
          this.cells[i] = [];
          for (var j=0; j<100; j++) {
              this.cells[i][j] = 0;
          }
      }
      // Prefilled cells
      [
          // Gosper glider gun
          [1, 5],[1, 6],[2, 5],[2, 6],[11, 5],[11, 6],[11, 7],[12, 4],[12, 8],[13, 3],[13, 9],[14, 3],[14, 9],[15, 6],[16, 4],[16, 8],[17, 5],[17, 6],[17, 7],[18, 6],[21, 3],[21, 4],[21, 5],[22, 3],[22, 4],[22, 5],[23, 2],[23, 6],[25, 1],[25, 2],[25, 6],[25, 7],[35, 3],[35, 4],[36, 3],[36, 4],
      ]
      .forEach(function(point) {
          self.cells[point[0]][point[1]] = 1;
      });

      this.update();
  }

  /**
   * Check which cells are still alive.
   */
  update() {
      var result = [];
      var self = this;

      /**
       * Return amount of alive neighbours for a cell
       */
      function _countNeighbours(x, y) {
          var amount = 0;

          function _isFilled(x, y) {
              return self.cells[x] && self.cells[x][y];
          }

          if (_isFilled(x-1, y-1)) amount++;
          if (_isFilled(x,   y-1)) amount++;
          if (_isFilled(x+1, y-1)) amount++;
          if (_isFilled(x-1, y  )) amount++;
          if (_isFilled(x+1, y  )) amount++;
          if (_isFilled(x-1, y+1)) amount++;
          if (_isFilled(x,   y+1)) amount++;
          if (_isFilled(x+1, y+1)) amount++;

          return amount;
      }

      this.cells.forEach(function(row, x) {
          result[x] = [];
          row.forEach(function(cell, y) {
              var alive = 0,
                  count = _countNeighbours(x, y);

              if (cell > 0) {
                  alive = count === 2 || count === 3 ? 1 : 0;
              } else {
                  alive = count === 3 ? 1 : 0;
              }

              result[x][y] = alive;
          });
      });

      this.cells = result;

      this.draw();
  }

  /**
   * Draw cells on canvas
   */
  draw() {
      var self = this;
      this.ctx.clearRect(0, 0, 1512, 512);
      this.cells.forEach(function(row, x) {
          row.forEach(function(cell, y) {
              self.ctx.beginPath();
              self.ctx.rect(x*8, y*8, 8, 8);
              if (cell) {
                  self.ctx.fill();
              } else {
                  self.ctx.stroke();
              }
          });
      });
      setTimeout(function() {self.update();}, 100);
  }

}
