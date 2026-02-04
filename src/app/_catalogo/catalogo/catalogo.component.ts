import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_servizi_globali/api.service';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Subject, take, takeUntil } from 'rxjs';
import { CambioLinguaService } from 'src/app/_servizi_globali/cambio-lingua.service';
 @Component({
   selector: 'app-catalogo',
   templateUrl: './catalogo.component.html',
   styleUrls: ['./catalogo.component.scss']
 })
 export class CatalogoComponent implements OnInit {
  distruggi$ = new Subject<void>();
  constructor(private api: ApiService, private cambioLinguaService: CambioLinguaService) {}

   locandinaFissa = 'assets/locandine_en/locandina_en_abbraccia_il_vento.webp';

   locandineSei: string[] = [
     this.locandinaFissa,
     this.locandinaFissa,
     this.locandinaFissa,
     this.locandinaFissa,
     this.locandinaFissa,
     this.locandinaFissa,
   ];

   righeDemo: { idCategoria: string; category: string; nomeCategoria: string; posters: string[] }[] = [];

   ngOnInit(): void {
       const codice = this.cambioLinguaService.leggiCodiceLingua();
    this.caricaCategorie(codice);

    this.cambioLinguaService.cambioLinguaApplicata$
      .pipe(takeUntil(this.distruggi$))
      .subscribe((x) => this.caricaCategorie(x.codice));
   }


  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  caricaCategorie(codiceLingua: string): void {
    this.api.getElencoCategorie(codiceLingua).pipe(take(1)).subscribe({
      next: (rit: IRispostaServer) => {
        const elenco = Array.isArray(rit.data) ? rit.data : [];

        this.righeDemo = elenco.map((c: any) => {
          const id = String(c.id_categoria ?? '');
          const codice = String(c.codice ?? '');
          const nome = String(c.nome ?? codice);
          return {
            idCategoria: id ? `cat_${id}` : `cat_${codice}`,
            category: codice,
            nomeCategoria: nome,
            posters: this.locandineSei,
          };
        });
      },
      error: (e) => console.log('Errore categorie', e),
    });
  }

   tracciaRigaCategoria(_indice: number, riga: { idCategoria: string }): string {
     return riga.idCategoria;
   }
 }
