// Modulo di routing che definisce le rotte del feature Catalogo e collega i path ai rispettivi componenti.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { FilmComponent } from './film/film.component';
import { SerieComponent } from './serie/serie.component';

const routes: Routes = [
  {
    // al vuoto rivedo catalogoComponent
    path: '',
    component: CatalogoComponent,
  },
  {
    // rotta di test
    path: 'film',
    component: FilmComponent,
  },
  {
    // rotta di test

    path: 'serie',
    component: SerieComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogoRoutingModule {}
