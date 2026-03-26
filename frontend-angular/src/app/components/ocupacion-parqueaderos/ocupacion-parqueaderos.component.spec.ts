import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OcupacionParqueaderosComponent } from './ocupacion-parqueaderos.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OcupacionParqueadero } from '../../models/vistas.model';

describe('OcupacionParqueaderosComponent - HU-37: Listar reportes', () => {
  let component: OcupacionParqueaderosComponent;
  let fixture: ComponentFixture<OcupacionParqueaderosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcupacionParqueaderosComponent],
      // Usamos NO_ERRORS_SCHEMA para ignorar mat-table, mat-icon, etc.
      // Así evitamos cualquier error de animaciones o módulos deprecados.
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OcupacionParqueaderosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE LÓGICA: calcularPorcentajeOcupacion ---

  it('debería calcular el porcentaje correctamente cuando hay celdas (Camino 1)', () => {
    // Arrange
    const mockOcupacion: OcupacionParqueadero = {
      nombreParqueadero: 'Parqueadero Central',
      totalCeldas: 100,
      celdasOcupadas: 75,
      celdasLibres: 25,
      porcentajeOcupacion: 0 // Se calcula dinámicamente
    } as any;

    // Act
    const resultado = component.calcularPorcentajeOcupacion(mockOcupacion);

    // Assert (75 / 100) * 100 = 75
    expect(resultado).toBe(75);
  });

  it('debería retornar 0 cuando el total de celdas es 0 (Evitar división por cero)', () => {
    // Arrange
    const mockOcupacion: OcupacionParqueadero = {
      totalCeldas: 0,
      celdasOcupadas: 0
    } as any;

    // Act
    const resultado = component.calcularPorcentajeOcupacion(mockOcupacion);

    // Assert
    expect(resultado).toBe(0);
  });

  // --- PRUEBA DE INPUTS (COBERTURA DE NODOS 2 Y 3) ---

  it('debería recibir correctamente los datos de ocupación y el estado de carga', () => {
    // Arrange
    const mockData: OcupacionParqueadero[] = [
      { nombreParqueadero: 'P1', totalCeldas: 10, celdasOcupadas: 5 } as any
    ];

    // Act
    component.ocupacionData = mockData;
    component.loading = true;
    fixture.detectChanges();

    // Assert
    expect(component.ocupacionData).toEqual(mockData);
    expect(component.loading).toBeTrue();
  });

  it('debería tener definidas las columnas para la tabla (Nodo 4)', () => {
    const columnasEsperadas = [
      'nombreParqueadero',
      'totalCeldas',
      'celdasOcupadas', 
      'celdasLibres', 
      'porcentajeOcupacion'
    ];
    expect(component.displayedColumns).toEqual(columnasEsperadas);
  });
});