import { Component,EventEmitter,Input,OnChanges,OnInit,Output, SimpleChanges } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import { UnidadProductivaService } from '../../services/unidad-productiva.service';
@Component({
  selector: 'app-add-edit-unidadp',
  templateUrl: './add-edit-unidadp.component.html',
  styleUrls: ['./add-edit-unidadp.component.css']
})
export class AddEditUnidadpComponent implements OnInit, OnChanges {

  

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedUnidadP: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  modalType = "Guardar";

  form = this.fb.group({
    nombreUnidadP: ["", Validators.required],
    coordenadas: [0, Validators.required],
    area: [0, Validators.required],
    profundidad: [0, Validators.required],
    observacion: ["", Validators.required],

    

  })


  constructor(
    private fb: FormBuilder,
    private uniadadProductivaService: UnidadProductivaService,
    private messageService: MessageService
  ){}
  
  ngOnInit(): void {
    this.obtenerUnidadP();
  }

  ngOnChanges(): void {
    if(this.selectedUnidadP){
      this.modalType = 'Actualizar';
      this.form.patchValue(this.selectedUnidadP);
    }else{
      this.form.reset();
      this.modalType = 'Guardar';
    }
  }
  closeModal(){
    this.form.reset();
    this.clickClose.emit(true);
  }

  obtenerUnidadP(){
    if(this.displayAddEditModal && this.selectedUnidadP){
      this.uniadadProductivaService.obtenerUnidadProductivaPorId(this.selectedUnidadP).subscribe(
        response => {
          this.form.get('nombreUnidadP')?.setValue(response.nombreUnidadP);
          this.form.get('coordenadas')?.setValue(response.coordenadas);
          this.form.get('area')?.setValue(response.area);
          this.form.get('observacion')?.setValue(response.observacion);
          this.form.get('profundidad')?.setValue(response.profundidad);
        }
      )
    }
  }

  addEditUnidadP(){
    const unidadPData = {
      nombreUnidadP: this.form.get('nombreUnidadP')?.value,
      coordenadas: this.form.get('coordenadas')?.value,
      area: this.form.get('area')?.value,
      profundidad: this.form.get('profundidad')?.value,
      observacion: this.form.get('observacion')?.value
    }

    this.uniadadProductivaService.addEditUnidadProductiva(unidadPData, this.selectedUnidadP).subscribe(
      response =>{
        this.clickAddEdit.emit(response);
        this.closeModal();
        const msg = this.modalType === 'Guardar'? 'Registro Guardado': 'Registro Actualizado';
        this.messageService.add({severity: 'success', summary: 'Exitoso', detail: msg});
      },
      error => {
        const msg = this.modalType === 'Guardar'? 'No puede Guardar este Registro': 'No puede Actualizar este Registro';
        this.messageService.add({severity: 'error', summary: 'Error', detail: msg})
      }
    )
  }

  onKeyPress(event: KeyboardEvent) {
    // Obtiene el código de la tecla presionada
    const keyCode = event.which || event.keyCode;
  
    // Permite solo números (0-9)
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  
}