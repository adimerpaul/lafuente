<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VentaDetalle extends Model{
    use SoftDeletes;
//    protected $fillable = ['venta_id', 'producto_id', 'cantidad', 'unidad', 'precio'];
//$table->foreignId('venta_id')->constrained('ventas');
//$table->foreignId('producto_id')->constrained('productos');
//$table->unsignedBigInteger('compra_detalle_id')->nullable();
//$table->foreign('compra_detalle_id')->references('id')->on('compra_detalles');
//$table->string('nombre')->nullable();
//$table->integer('cantidad')->nullable();
//$table->string('unidad')->nullable();
//$table->string('lote')->nullable();
//$table->date('fecha_vencimiento')->nullable();
//$table->integer('precio')->nullable();
//$table->softDeletes();
//$table->timestamps();
    protected $fillable = [
        'venta_id',
        'producto_id',
        'compra_detalle_id',
        'nombre',
        'cantidad',
        'unidad',
        'lote',
        'fecha_vencimiento',
        'precio'
    ];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    function venta(){
        return $this->belongsTo(Venta::class);
    }
    function producto(){
        return $this->belongsTo(Producto::class);
    }
}
