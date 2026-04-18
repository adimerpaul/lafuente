<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model{
    use SoftDeletes;
    protected $fillable = [
        'nombre',
        'farmacia_tipo',
        'descripcion',
        'unidad',
        'precio',
        'stock',
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
        if (array_key_exists('cantidad', $this->attributes)) {
            return (float) $this->attributes['cantidad'];
        }

        $cantidad = $this->hasMany(CompraDetalle::class, 'producto_id')
            ->where('estado', 'Activo')
            ->where('cantidad_venta', '>', 0)
            ->sum('cantidad_venta');
        return (float) $cantidad;
    }
//comprasDetalles
    function comprasDetalles(){
        return $this->hasMany(CompraDetalle::class);
    }
}
