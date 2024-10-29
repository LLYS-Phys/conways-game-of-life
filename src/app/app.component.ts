import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { Dialog } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  cellSize = 0
  cellColor = 'black'
  isRunning = false;
  animationId: number | null = null;
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  numRows: number | null = null
  numCols: number | null = null
  grid: number[][] | null = []

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
    if (localStorage.getItem("canvasWidth")) {
      this.canvas.width = Number(localStorage.getItem("canvasWidth"))
    } else { 
      this.canvas.width = 1200 
      localStorage.setItem("canvasWidth", "1200")
    }
    if (localStorage.getItem("canvasHeight")) {
      this.canvas.height = Number(localStorage.getItem("canvasHeight"))
    } else {
      this.canvas.height = 800
      localStorage.setItem("canvasHeight", "800")
    }
    if (localStorage.getItem("cellSize")) {
      this.cellSize = Number(localStorage.getItem("cellSize"))    
    } else {
      this.cellSize = 10
      localStorage.setItem("cellSize", "10")
    }
    if (localStorage.getItem("cellColor")) {
      this.cellColor = localStorage.getItem("cellColor")!
    } else {
      this.cellColor = 'black'
      localStorage.setItem("cellColor", "black")
    }
    this.ctx = this.canvas.getContext('2d');
    this.numRows = Math.floor(this.canvas.height / this.cellSize);
    this.numCols = Math.floor(this.canvas.width / this.cellSize);
    this.grid = this.createGrid();
  }

  // Function to initialize the grid
  createGrid() {
    if (this.numRows && this.numCols){
      for (let i = 0; i < this.numRows; i++) {
        this.grid![i] = [];
        for (let j = 0; j < this.numCols; j++) {
            this.grid![i][j] = Math.random() > 0.7 ? 1 : 0; // Random initialization
        }
      }
    }
    return this.grid;
  }

  // Function to draw the grid
  drawGrid() {
    this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    for (let i = 0; i < this.numRows!; i++) {
        for (let j = 0; j < this.numCols!; j++) {
            if (this.grid![i][j] === 1) {
                this.ctx!.fillStyle = this.cellColor
                this.ctx!.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }
  }

  // Function to update the grid based on Conway's rules
  updateGrid() {
    const newGrid: number[][] = [];
    for (let i = 0; i < this.numRows!; i++) {
        newGrid[i] = [];
        for (let j = 0; j < this.numCols!; j++) {
            const neighbors = this.countNeighbors(i, j);
            if (this.grid![i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0; 
            } else if (this.grid![i][j] === 0 && neighbors === 3) {
                newGrid[i][j] = 1; 
            } else {
                newGrid[i][j] = this.grid![i][j]; 
            }
        }
    }
    this.grid = newGrid;
  }

  // Function to count live neighbors of a cell
  countNeighbors(row: number, col: number) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < this.numRows! && c >= 0 &&
                c < this.numCols! && !(i === 0 && j === 0)) {
                count += this.grid![r][c];
            }
        }
    }
    return count;
  }

  // Main loop to update and draw the grid
  mainLoop = () => {
      this.updateGrid();
      this.drawGrid();
      this.isRunning = true;
      if (this.isRunning) this.animationId = requestAnimationFrame(this.mainLoop);
  }

  start() {
    if (!this.isRunning) this.mainLoop();
  }

  pause() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId!)
  }

  restart() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId!)
    this.grid = this.createGrid();
    this.drawGrid();
  }

  settings() {
    this.dialog.open(Dialog, {
      width: '30vw',
      autoFocus: false
    });
  }
}
