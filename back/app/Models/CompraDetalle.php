<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompraDetalle extends Model{
    protected $fillable = [
        'compra_id',
        'user_id',
        'producto_id',
        'proveedor_id',
        'nombre',
        'precio',
        'cantidad',
        'total',
        'estado',
        'lote',
        'fecha_vencimiento',
        'nro_factura'
    ];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    function compra(){
        return $this->belongsTo(Compra::class);
    }
    function user(){
        return $this->belongsTo(User::class);
    }
    function producto(){
        return $this->belongsTo(Producto::class);
    }
    function proveedor(){
        return $this->belongsTo(Proveedor::class);
    }
}
