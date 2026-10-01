import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LinhaTempo, LinhaTempoMarca } from '../models/portal-os.model';

@Component({
  selector: 'app-linha-tempo',
  templateUrl: './linha-tempo.component.html',
  styleUrls: ['./linha-tempo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinhaTempoComponent {
  @Input() linhaTempo!: LinhaTempo;
  @Input() markerSelecionado?: number;
  @Output() marcaClick = new EventEmitter<number>();

  selecionar(marca: LinhaTempoMarca): void {
    this.marcaClick.emit(marca.markerId);
  }

  trackByMarca(_indice: number, marca: LinhaTempoMarca): number {
    return marca.markerId;
  }
}
