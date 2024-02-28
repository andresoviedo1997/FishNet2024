import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoAlimento } from '../../models/tipo-alimento';
import { FormBuilder, Validators } from '@angular/forms';
import { InvEntradaAlimentoService } from '../../services/inv-entrada-alimento.service';
import { TipoAlimentoService } from '../../services/tipo-alimento.service';
import { MessageService } from 'primeng/api';
import { Lote } from '../../models/lote';
import { LoteService } from '../../services/lote.service';
import { InvSalidaAlimentosService } from '../../services/inv-salida-alimento.service';

@Component({
  selector: 'app-add-edit-inv-alimento',
  templateUrl: './add-edit-inv-alimento.component.html',
  styleUrls: ['./add-edit-inv-alimento.component.css']
})
export class AddEditInvAlimentoComponent {

  tipoAlimentos: TipoAlimento[] = [];
  lotes: Lote[] = [];

  @Input () displayAddModal: boolean = true;
  @Input() selectedInventario: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  modalType = "Guardar";

  form = this.fb.group({
    numeroFactura: ["", Validators.required],
    numeroKilos: [0, Validators.required],
    tipoAlimento: [0, Validators.required],
    lote: [0, Validators.required]  
    
  });

  constructor(
    private fb: FormBuilder,
    private entradaService: InvEntradaAlimentoService,
    private salidaService: InvSalidaAlimentosService,
    private tipoAlimentoService: TipoAlimentoService,
    private loteService: LoteService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.getTipoAlimento();
    this.getLote();
  }

  ngOnChanges(): void {
    if (this.selectedInventario) {
      this.modalType = 'Guardar';
      this.entradaService.obtenerEntradaAlimentosPorId(this.selectedInventario).subscribe(
        response => {
          const { tipoAlimento, ...rest } = response;
          const partialData = { ...rest, tipoAlimento: tipoAlimento.id };
          this.form.patchValue(partialData);
        }
      );
    } 
  }

  closeModal(){
    this.form.reset();
    this.clickClose.emit(true);
  }

  previewData(){
    console.log('Datos a guardar:', this.form.value);
  }

  addSalida(){

    this.previewData();

    // Aquí puedes realizar la operación de guardar o actualizar según tu lógica
    this.entradaService.obtenerEntradaAlimentosPorId(this.selectedInventario).subscribe(
      response =>{
        this.form.get('numeroFactura')?.setValue(response.numeroFactura);                                     
        this.form.get('numeroKilos')?.setValue(response.numeroKilos);                 
        this.form.controls['tipoAlimento'].setValue(response.tipoAlimento.id);
      }
    );
    
    const InventarioData = {
      numeroFactura: this.form.get('numeroFactura')?.value,
      numeroKilos: this.form.get('numeroKilos')?.value,
      tipoAlimentoId: this.form.get('tipoAlimento')?.value,
      loteId: this.form.get('lote')?.value
    }
  
    this.salidaService.agregarSalidaAlimentos(InventarioData).subscribe(
      response =>{
        this.clickAdd.emit(response);
        this.closeModal();
        const msg = 'Registro Guardado';
        this.messageService.add({severity: 'success', summary: 'Exitoso', detail: msg});
        console.log('Guardar');
      },
      error => {
        const msg = this.modalType === 'Guardar'? 'No puede Guardar este Registro': 'No puede Actulizar este Registro';
        this.messageService.add({severity: 'error', summary: 'Error', detail: msg});
      }
    )
  }

  getTipoAlimento(){
    this.tipoAlimentoService.obtenerTipoAlimento().subscribe(
      response => {
        this.tipoAlimentos = response
      }
    )
  }

  getLote(){
    this.loteService.obtenerLote().subscribe(
      response => {
        this.lotes = response
      }
    )
  }
}