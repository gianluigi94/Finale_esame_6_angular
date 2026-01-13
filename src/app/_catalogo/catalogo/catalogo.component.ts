import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription, take } from 'rxjs';
import { ApiService } from 'src/app/_servizi_globali/api.service';
import { CambioLinguaService } from 'src/app/_servizi_globali/cambio-lingua.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit, OnDestroy {
    constructor(
    public api: ApiService,
    public cambioLingua: CambioLinguaService
  ) {}

  sottoscrizioni = new Subscription();

  categorieDb: any[] = [];
  categorieTraduzioniDb: any[] = [];
  categorieLocandineDb: any[] = [];
  locandinaDemo = 'assets/locandine_it/locandina_it_abbraccia_il_vento.webp';

    locandineDemo: string[] = [
    this.locandinaDemo,
    this.locandinaDemo,
    this.locandinaDemo,
    this.locandinaDemo,
    this.locandinaDemo,
    this.locandinaDemo,
    this.locandinaDemo,
    this.locandinaDemo,
  ];

     righeDemo: { idCategoria: string; category: string; posters: string[] }[] = [];

  ngOnInit(): void {

    this.sottoscrizioni.add(
      this.cambioLingua.cambioLinguaApplicata$.subscribe(() => {
        this.ricostruisciRighe();
      })
    );
  }

  ngOnDestroy(): void {
    this.sottoscrizioni.unsubscribe();
  }



  ricostruisciRighe(): void {
    const codiceLingua = this.cambioLingua.leggiCodiceLingua(); // 'it' | 'en'
    const mappaNome = this.costruisciMappaNomeCategorie(codiceLingua);
    const mappaLocandine = this.costruisciMappaLocandineCategorie(codiceLingua);

    this.righeDemo = (this.categorieDb || []).map((cat: any) => {
      const idCategoria = cat?.id_categoria;
      const codice = String(cat?.codice || '');
      const nome = mappaNome[idCategoria] || codice;
            const posters = mappaLocandine[String(idCategoria)] || [];
      return { idCategoria: String(idCategoria), category: nome, posters: posters.length ? posters : this.locandineDemo };
    });
  }

  costruisciMappaNomeCategorie(codiceLingua: string): Record<string, string> {
    const mappa: Record<string, string> = {};
    const idLingua = this.idLinguaDaCodice(codiceLingua);

    for (const tr of (this.categorieTraduzioniDb || [])) {
      if (String(tr?.id_lingua) !== String(idLingua)) continue;
      const idCategoria = String(tr?.id_categoria || '');
      const nome = String(tr?.nome || '');
      if (idCategoria && nome) mappa[idCategoria] = nome;
    }
    return mappa;
  }

  idLinguaDaCodice(codiceLingua: string): number {
    return codiceLingua === 'it' ? 1 : 2;
  }


  costruisciMappaLocandineCategorie(codiceLingua: string): Record<string, string[]> {
    const mappa: Record<string, string[]> = {};

    for (const r of (this.categorieLocandineDb || [])) {
      if (String(r?.lingua) !== String(codiceLingua)) continue;
      const idCategoria = String(r?.id_categoria || '');
      const img = String(r?.img_locandina || '');
      if (!idCategoria || !img) continue;

      if (!mappa[idCategoria]) mappa[idCategoria] = [];
      mappa[idCategoria].push(img);
    }

    return mappa;
  }


  tracciaRigaCategoria(_indice: number, riga: { idCategoria: string }): string {
    return riga.idCategoria;
  }
}
