import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'dialog',
    templateUrl: 'dialog.component.html',
    styleUrl: 'dialog.component.css',
    standalone: true,
    imports: [MatButtonModule, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogActions, ReactiveFormsModule, MatInputModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class Dialog implements OnInit {
    readonly dialogRef = inject(MatDialogRef<Dialog>);

    canvasSettings = new FormGroup({
      canvasWidth: new FormControl(''),
      canvasHeight: new FormControl(''),
      cellSize: new FormControl(''),
      cellColor: new FormControl('')
    });

    ngOnInit() {
      this.canvasSettings.setValue({
        canvasWidth: localStorage.getItem("canvasWidth") ? localStorage.getItem("canvasWidth") : '',
        canvasHeight: localStorage.getItem("canvasHeight") ? localStorage.getItem("canvasHeight") : '',
        cellSize: localStorage.getItem("cellSize") ? localStorage.getItem("cellSize") : '',
        cellColor: localStorage.getItem("cellColor") ? localStorage.getItem("cellColor") : ''
      })
    }

    onSubmit() {
      localStorage.setItem("canvasWidth", this.canvasSettings.value.canvasWidth!)
      localStorage.setItem("canvasHeight", this.canvasSettings.value.canvasHeight!)
      localStorage.setItem("cellSize", this.canvasSettings.value.cellSize!)
      localStorage.setItem("cellColor", this.canvasSettings.value.cellColor!)

      this.dialogRef.close()
      location.reload()
    }
  }