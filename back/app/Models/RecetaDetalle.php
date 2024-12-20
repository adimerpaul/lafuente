<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecetaDetalle extends Model{
    use SoftDeletes;
    protected $fillable = [
        'receta_id',
        'producto_id',
        'cantidad',
        'unidad',
        'via',
        'frecuencia',
        'duracion',
        'indicaciones',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    function receta(){
        return $this->belongsTo(Receta::class);
    }
    function producto(){
        return $this->belongsTo(Producto::class);
    }
}
