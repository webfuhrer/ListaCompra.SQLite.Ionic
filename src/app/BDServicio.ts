
import { SQLite , SQLiteObject} from '@ionic-native/sqlite/ngx';
import { Producto } from './home/Producto.module';
import { ResolvedReflectiveFactory } from '@angular/core';



export class AccesoBD{
    base_datos: SQLiteObject;
    
    constructor (private sqlite: SQLite)
    {
      
        }
        inicializarBD():Promise<boolean>
        {
         let p:Promise<boolean> =new Promise((resolve, reject)=>{
          this.sqlite.create({
            name: 'bd_con_rowid2.db',
            location: 'default'
  
    
  }).then((db: SQLiteObject)=>{this.base_datos=db;db.executeSql('create table if not exists lista_productos(nombre VARCHAR(32))', [])
          .then((d) =>{ resolve(true);})
          .catch(e => {console.log("Error:"+e); resolve(false)});});

         })
         
         return p;
        
          
        }
    insertarProducto(p:Producto): Promise<number>
    {
      let promesa:Promise<number>=new Promise((resolve, reject)=>
        {
          let sql="INSERT INTO lista_productos ( nombre) VALUES (?)";
        /*NO Hace falta el open xq al instanciar la clase ya se llama al create que la crea o la abre*/ 
        this.base_datos.executeSql(sql, [p.nombre]).then((d)=>{
         resolve(d.insertId)}).catch(()=>{reject(-1);});
        }
      );
        return promesa;
    }
    borrarProducto(producto:Producto):Promise<boolean>
    {
      let id: number=producto.id;
      console.log("Borrando producto "+id);
      let p:Promise<boolean> =new Promise(
        (resolve, reject)=>
          {
            let sql="DELETE FROM lista_productos where ROWID=?";
            this.base_datos.executeSql(sql, [id]).then(()=>resolve (true)).catch(()=>reject(false));
          }
      );
      return p;
    }
    listarProductos():Promise<Array<Producto>> 
    {
     let promesa:Promise<Array<Producto>>=new Promise(
       (resolve, reject)=>{
        let lista_productos: Array<Producto> =new Array();
        let sql: string ="SELECT * FROM lista_productos";
        this.base_datos.executeSql(sql, []).then((datos)=>{
          console.log("LISTADO PRODUCTOS:");
          for (let i=0; i<datos.rows.length; i++)
            {
              let id_producto=datos.rows.item(i).ROWID;
              let nombre=datos.rows.item(i).nombre;
              
              console.log ( id_producto+" "+nombre);
              let p: Producto= {nombre: nombre, id:id_producto}
              lista_productos.push(p);
            }
            resolve(lista_productos);
        }).catch((e)=>reject("Ha habido un error: "+e));
       }
     );
     return promesa;
  
    }
}
