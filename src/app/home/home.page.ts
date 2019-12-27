import { Component} from '@angular/core';
import { Producto } from './Producto.module';
import { AlertExample } from '../Alertas.module';
import { AlertController, Platform } from '@ionic/angular';
import { AccesoBD } from '../BDServicio';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  

}
    borrar(producto:Producto)
    {
      let alertController: AlertController=new AlertController();
      let alerta:AlertExample=new AlertExample(alertController);
      const index = this.lista_productos.indexOf(producto, 0);//Encuentra el indice en el que está p. Empezando en 0.
      alerta.alertaBorrado(producto.nombre).then((d)=>{
        if (d.role=='aceptar')
          {
            if (index > -1) {
              this.acceso_bd.borrarProducto(producto).then(()=>
                  {
                    this.lista_productos.splice(index, 1);console.log ("Borrado "+producto.id);
                  });
            }
          }
 });
     

}

 nombre_producto:string="";
 lista_productos=
 [
]
  constructor(public acceso_bd:AccesoBD, private plataforma: Platform) {
    this.plataforma.ready().then(()=>{

      console.log("Dentro del constructoir de home.page llamando a listarProductos");
      this.acceso_bd.inicializarBD().then(()=>
              {
                this.acceso_bd.listarProductos().then((lista)=>this.lista_productos=lista).catch((e)=>console.log("ERROR"));
              }
      ).catch(()=>console.log("Error al recuperar productos"))

    });
    
    

  }

  insertarProducto()
  {
    
    let indice:number=this.lista_productos.length;
    //this.lista_productos.insertarProducto(indice,this.nombre_producto );
    let p:Producto={nombre: this.nombre_producto, id:0}
    this.acceso_bd.insertarProducto(p).then((id)=>p.id=id);
    console.log(p);
    
    this.lista_productos.push(p);
    this.nombre_producto="";
  }

  
}
