// servizio dove decido il title da inserire in base alla pagina in cui si trova l'utente
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CambioLinguaService } from './cambio-lingua.service';

@Injectable({ providedIn: 'root' }) // Registro il servizio nel root injector
export class TitoloPaginaService {
  constructor(
    private title: Title, // Uso Title per impostare il titolo del browser
    private router: Router, // Uso Router per leggere URL e ascoltare navigazioni
    private cambioLinguaService: CambioLinguaService // Uso CambioLinguaService per sapere la lingua corrente
  ) {}

  /**
   * Avvia la logica di aggiornamento del titolo della pagina.
   *
   * Imposta subito il titolo in base all'URL corrente e poi si mette in ascolto:
   * - delle navigazioni del router (NavigationEnd) per aggiornare il titolo a ogni cambio pagina
   * - del cambio lingua applicato, per ricalcolare il titolo nella nuova lingua mantenendo la stessa rotta
   *
   * @returns void
   */
  avvia(): void {
    this.aggiornaTitolo(this.router.url || ''); // Imposto subito il titolo iniziale in base all'URL corrente

    this.router.events // Ascolto gli eventi del router
      .pipe(filter((ev) => ev instanceof NavigationEnd)) // Tengo solo gli eventi di fine navigazione
      .subscribe((ev: any) => {
        // Quando finisce una navigazione aggiorno il titolo
        const url =
          ev && ev.urlAfterRedirects
            ? ev.urlAfterRedirects
            : ev && ev.url
            ? ev.url
            : ''; // Ricavo l'URL finale dopo eventuali redirect
        this.aggiornaTitolo(url); // Aggiorno il titolo usando l'URL calcolato
      });

    // Segno che devo aggiornare il titolo anche al cambio lingua
    this.cambioLinguaService.cambioLinguaApplicata$.subscribe(() => {
      // Ascolto l'evento che dice che la nuova lingua è stata applicata
      this.aggiornaTitolo(this.router.url || ''); // Ricalcolo il titolo con la stessa pagina ma nella nuova lingua
    });
  }

  /**
   * Calcola e imposta il titolo del browser in base alla rotta  e alla lingua corrente.
   *
   * Normalizza l'URL rimuovendo query string e hash, poi sceglie un titolo localizzato
   * per le rotte note e infine usa 'Title' di Angular per applicarlo.
   *
   * @param url URL (o path) da cui ricavare la rotta corrente.
   * @returns void
   */
  private aggiornaTitolo(url: string): void {
    const codice = this.cambioLinguaService.leggiCodiceLingua(); // Leggo il codice lingua '
    const path = this.pulisciUrl(url); // Pulisco l'URL da query e hash

    const base = 'ScienceCode X'; // Definisco il nome base del sito da mettere sempre nel titolo
    let titolo = base; // Imposto un titolo di default

    if (path === '/benvenuto' || path === '/benvenuto/') {
      // Controllo se sono nella pagina benvenuto
      titolo = codice === 'it' ? `Benvenuto - ${base}` : `Welcome - ${base}`;
    } else if (path === '/benvenuto/login') {
      // Controllo se sono nella pagina login
      titolo = codice === 'it' ? `Accedi - ${base}` : `Sign in - ${base}`;
    } else if (path === '/catalogo' || path === '/catalogo/') {
      // Controllo se sono nella home catalogo
      titolo =
        codice === 'it'
          ? `Film e Serie - ${base}`
          : `Movies & Series - ${base}`;
    } else if (path === '/catalogo/film') {
      // Controllo se sono nella pagina film
      titolo = codice === 'it' ? `Film - ${base}` : `Movies - ${base}`;
    } else if (path === '/catalogo/serie') {
      // Controllo se sono nella pagina serie
      titolo = codice === 'it' ? `Serie - ${base}` : `Series - ${base}`;
    }

    this.title.setTitle(titolo); // Imposto il titolo del browser con quello calcolato
  }

  /**
 * Rimuove query string e hash dall'URL, restituendo solo il path.
 *
 * @param url URL completa o parziale da normalizzare.
 * @returns Path dell'URL senza '?' e '#'.
 */
  private pulisciUrl(url: string): string {
    return (url || '').split('?')[0].split('#')[0]; // Ritorno solo il path prima di '?' e '#'
  }
}
