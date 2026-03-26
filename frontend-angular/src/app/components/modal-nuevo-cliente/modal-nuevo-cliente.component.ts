import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CrearClienteFacturaDto } from '../../models/facturacion.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cliente-factura-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './modal-nuevo-cliente.component.html',
  styleUrls: ['./modal-nuevo-cliente.component.scss']
})
export class ClienteFacturaModalComponent {
  formGroup: FormGroup;
  loading = false;

  constructor(
    readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClienteFacturaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formGroup = this.formBuilder.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.loading = true;
      const cliente: CrearClienteFacturaDto = this.formGroup.value;
      setTimeout(() => {
        this.dialogRef.close(cliente);
        this.loading = false;
      }, 2000); 
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}