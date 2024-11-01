import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from './dialog/dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  cellSize: number = 10
  cellColor: string = '#000000'
  generationTimeMs: number = 0
  generationCount: number = 1

  isRunning: boolean = false;
  animationId: number | null = null;
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  numRows: number | null = null
  numCols: number | null = null
  grid: number[][] = []

  ngOnInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
    if (!localStorage.getItem("canvasWidth")) localStorage.setItem("canvasWidth", (screen.width-32).toString())
    this.canvas.width = Number(localStorage.getItem("canvasWidth"))

    if (!localStorage.getItem("canvasHeight")) localStorage.setItem("canvasHeight", (screen.height/2).toString())
    this.canvas.height = Number(localStorage.getItem("canvasHeight"))

    if (!localStorage.getItem("cellSize")) localStorage.setItem("cellSize", this.cellSize.toString())
    this.cellSize = Number(localStorage.getItem("cellSize"))    

    if (!localStorage.getItem("cellColor")) localStorage.setItem("cellColor", this.cellColor)
    this.cellColor = localStorage.getItem("cellColor")!

    if (!localStorage.getItem("generationTimeMs")) localStorage.setItem("generationTimeMs", this.generationTimeMs.toString())
    this.generationTimeMs = Number(localStorage.getItem("generationTimeMs"))
    
    this.ctx = this.canvas.getContext('2d');
    this.numRows = Math.floor(this.canvas.height / this.cellSize);
    this.numCols = Math.floor(this.canvas.width / this.cellSize);
    this.grid = this.createGrid();
    this.drawGrid()
  }

  createGrid() {
    if (this.numRows && this.numCols){
      for (let i = 0; i < this.numRows; i++) {
        this.grid![i] = [];
        for (let j = 0; j < this.numCols; j++) {
            this.grid![i][j] = Math.random() > 0.7 ? 1 : 0;
        }
      }
    }
    return this.grid;
  }

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

  mainLoop = () => {
    this.updateGrid();
    this.drawGrid();
    this.generationCount++
    setTimeout(() => {
      if (this.isRunning) {
        this.animationId = requestAnimationFrame(this.mainLoop);
      }
    }, this.generationTimeMs);
  }

  start_pause() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.mainLoop();
    }
    else {
      this.isRunning = false;
      cancelAnimationFrame(this.animationId!)
    }
  }

  restart() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId!)
    this.grid = this.createGrid();
    this.drawGrid();
    this.generationCount = 1
  }

  openSettings() {
    this.dialog.open(Dialog, {
      width: '30vw',
      autoFocus: false
    });
  }
}