import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Validators } from '@angular/forms';

@Component({
    selector: 'dialog',
    templateUrl: 'dialog.component.html',
    styleUrl: 'dialog.component.scss',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule, MatInputModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class Dialog implements OnInit {
    readonly dialogRef = inject(MatDialogRef<Dialog>);

    canvasSettings = new FormGroup({
      canvasWidth: new FormControl('', [Validators.required, Validators.min(100)]),
      canvasHeight: new FormControl('', [Validators.required, Validators.min(100)]),
      cellSize: new FormControl('', [Validators.required, Validators.min(1)]),
      cellColor: new FormControl(''),
      generationTimeMs: new FormControl('', [Validators.required, Validators.min(0)])
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
      return this.canvasSettings.status == "VALID" ? false : true
    }

    onSubmit() {
      localStorage.setItem("canvasWidth", (Number(this.canvasSettings.value.canvasWidth!) > screen.width-32 || Number(this.canvasSettings.value.canvasWidth!) < 1 
                                              ? (screen.width-32).toString()
                                              : this.canvasSettings.value.canvasWidth!).toString())
      localStorage.setItem("canvasHeight", Number(this.canvasSettings.value.canvasHeight!) < 1 
                                              ? (screen.height/2).toString() 
                                              : this.canvasSettings.value.canvasHeight!.toString())
      localStorage.setItem("cellSize", Number(this.canvasSettings.value.cellSize!) < 1 ? "10" : this.canvasSettings.value.cellSize!.toString())
      localStorage.setItem("cellColor", this.canvasSettings.value.cellColor!)
      localStorage.setItem("generationTimeMs", Number(this.canvasSettings.value.generationTimeMs!) < 1 ? "0" : this.canvasSettings.value.generationTimeMs!.toString())

      this.dialogRef.close()
      location.reload()
    }
  }