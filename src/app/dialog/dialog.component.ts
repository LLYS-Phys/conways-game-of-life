import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'dialog',
    templateUrl: 'dialog.component.html',
    styleUrl: 'dialog.component.css',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule, MatInputModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class Dialog implements OnInit {
    readonly dialogRef = inject(MatDialogRef<Dialog>);

    canvasSettings = new FormGroup({
      canvasWidth: new FormControl(''),
      canvasHeight: new FormControl(''),
      cellSize: new FormControl(''),
      cellColor: new FormControl(''),
      generationTimeMs: new FormControl('')
    });

    ngOnInit() {
      this.canvasSettings.setValue({
        canvasWidth: localStorage.getItem("canvasWidth"),
        canvasHeight: localStorage.getItem("canvasHeight"),
        cellSize: localStorage.getItem("cellSize"),
        cellColor: localStorage.getItem("cellColor"),
        generationTimeMs: localStorage.getItem("generationTimeMs")
      })
    }

    get buttonStatus() {
      return this.canvasSettings.value.canvasWidth && this.canvasSettings.value.canvasHeight && this.canvasSettings.value.cellSize ? false : true
    }

    onSubmit() {
      localStorage.setItem("canvasWidth", (Number(this.canvasSettings.value.canvasWidth!) > screen.width-32 ? screen.width-32 : this.canvasSettings.value.canvasWidth!).toString())
      localStorage.setItem("canvasHeight", this.canvasSettings.value.canvasHeight!)
      localStorage.setItem("cellSize", this.canvasSettings.value.cellSize!)
      localStorage.setItem("cellColor", this.canvasSettings.value.cellColor!)
      localStorage.setItem("generationTimeMs", Number(this.canvasSettings.value.generationTimeMs!) < 1 ? "0" : this.canvasSettings.value.generationTimeMs!)

      this.dialogRef.close()
      location.reload()
    }
  }