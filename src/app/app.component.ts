import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'conways-game-of-life';

  settingsOpen = false

  isRunning = false;
  animationId: number | null = null;
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  cellSize = 10
  numRows: number | null = null
  numCols: number | null = null
  grid: number[][] | null = null

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.numRows = Math.floor(this.canvas.height / this.cellSize);
    this.numCols = Math.floor(this.canvas.width / this.cellSize);
    this.grid = this.createGrid();
  }

  // Function to initialize the grid
  createGrid() {
    console.log("create grid")
    const grid: number[][] = [];
    if (this.numRows && this.numCols){
      for (let i = 0; i < this.numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < this.numCols; j++) {
            grid[i][j] = Math.random() > 0.7 ? 1 : 0; // Random initialization
        }
      }
    }
    return grid;
  }

  // Function to draw the grid
  drawGrid() {
    this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    for (let i = 0; i < this.numRows!; i++) {
        for (let j = 0; j < this.numCols!; j++) {
            if (this.grid![i][j] === 1) {
                this.ctx!.fillStyle = 'black';
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
    this.settingsOpen = !this.settingsOpen
  }
}
