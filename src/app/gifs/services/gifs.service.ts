import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';


@Injectable({
  providedIn: 'root'
})

export class GifsService {

  private _apiKey: string = 'zxqJegpnOorx6qC54SRwZZZ4R9VnD6cd';
  private _servicioURL: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];


  public resultados: Gif[] = [];

  get historial(): string[] {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    //si no encuentra nada coge un array vacion
    //la exclamacion al final es para que confie en nosotros de que el valor no va a ser null (aunque si lo es tomara [])
    
    this.resultados = JSON.parse(localStorage.getItem('resultadosUltimaBusqueda')!) || [];
  }



  buscarGifs(query: string) {

    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) { //is new?
      this._historial.unshift(query); //add
      this._historial = this._historial.splice(0, 10); //cut  //cut's last (n11)

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
        .set('api_key', this._apiKey)
        .set('limit', '10')
        .set('q', query);

    this.http.get<SearchGifsResponse>(`${this._servicioURL}/search`, {params})
      .subscribe(resp => {
        this.resultados = resp.data;
        localStorage.setItem('resultadosUltimaBusqueda', JSON.stringify(this.resultados));
      });

  }

}
