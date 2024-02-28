import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnidadProductiva } from 'src/app/components/models/unidad-productiva';
import { UnidadProductivaService } from 'src/app/components/services/unidad-productiva.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-unidad-productiva',
  templateUrl: './unidad-productiva.component.html',
  styleUrls: ['./unidad-productiva.component.css']
})
export class UnidadProductivaComponent implements OnInit, OnDestroy {

  //esAdministrador: boolean = false; // botton en el cual aparece las opciones de un crud
  unidad: UnidadProductiva[] = [];
  displayAddEditModal = false;
  selectedUnidadP: any = null;
  subscriptions: Subscription[] = [];
  UpSubscription: Subscription = new Subscription();
  fechaFiltro:Date | null = null;
  nombreFiltro: string = '';

  //eliminar botton de eliminar en unidad productiva
 public mostrarBotonEliminar: boolean = true;
 public  esAdministrador: boolean = false;

  constructor(
    private authService: AuthService,
    private unidadproductivaService: UnidadProductivaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  

  isLoggedIn(): boolean {
    // Lógica para verificar si el usuario está autenticado
    // Por ejemplo, podrías comprobar si hay un token de autenticación válido en el almacenamiento local
    return false; // Cambia esta lógica según tu implementación real
  }

  isAdmin(): boolean {
    // Lógica para verificar si el usuario es administrador
    return this.esAdministrador; // Cambia esta lógica según tu implementación real
  }

  ngOnInit(): void {
    this.obtenerUnidadProductiva();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedUnidadP = null;
  }

  hideAddModal(isClosed: boolean) {
    this.obtenerUnidadProductiva();
    this.displayAddEditModal = !isClosed;
  }

  guardaroEditarUnidadPList(newData: any) {
    if (this.selectedUnidadP && newData.id === this.selectedUnidadP.id) {
      const uniadPIndex = this.unidad.findIndex(data => data.id === newData.id);
      this.unidad[uniadPIndex] = newData;
    }
  }

  eliminar(id: number): void {
    this.confirmationService.confirm({
        message: '¿Quieres Eliminar este Registro?',
      header: 'Confirmacion de Eliminar Registro',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'bg-green-500 text-white py-2 px-2',
      rejectButtonStyleClass: 'bg-red-500 py-2 px-2 text-white mr-2',
      accept: () => {
        this.unidadproductivaService.eliminarUnidadProductiva(id).subscribe(
          response => {
            this.messageService.add({ severity: 'Exitoso', summary: 'Exitoso', detail: 'Registro Elimindo' })
            this.obtenerUnidadProductiva();
            this.mostrarBotonEliminar = true;
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error })
          }
        )
      },
    }
    )
  };

  showEdit(id: number){
    this.displayAddEditModal = true;
    this.selectedUnidadP = id;
  }

  obtenerUnidadProductiva(): void {
    this.unidadproductivaService.obtenerUnidadProductiva().subscribe(unidadP => {

      this.unidad = unidadP;
      console.log(this.unidad);
    });

    this.subscriptions.push(this.UpSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filtro(){
    if(this.fechaFiltro || this.nombreFiltro){
      this.unidad = this.unidad.filter((unidad) => {
          const fechaMatch = !this.fechaFiltro || unidad.fechaCreacion === this.fechaFiltro;
          const nombreMatch = !this.nombreFiltro || unidad.nombreUnidadP.toLowerCase().includes(this.nombreFiltro.toLowerCase());
          return fechaMatch && nombreMatch;
    });
  }else{
    this.obtenerUnidadProductiva();
  }
}

    borrarBusqueda() {
      // Restaura la lista completa de unidades
      this.obtenerUnidadProductiva();
      // Limpia la fecha de filtro
      this.fechaFiltro = null;
    }
}
