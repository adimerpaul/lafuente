<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model{
    use SoftDeletes;
    protected $fillable = [
        'nombre',
        'descripcion',
        'unidad',
        'precio',
//        'stock',
        'stock_minimo',
        'stock_maximo',
        'imagen',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
//    appende sotkc tien que de delas compras detalles
    protected $appends = ['cantidad'];
    public function getCantidadAttribute(){
        $cantidad = $this->hasMany(CompraDetalle::class, 'producto_id')
            ->where('estado', 'Activo')
            ->where('cantidad_venta', '>', 0)
            ->sum('cantidad_venta');
        return $cantidad;
    }
}
