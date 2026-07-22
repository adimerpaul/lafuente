<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Receta extends Model{
    use SoftDeletes;
    protected $fillable = [
        'paciente_id',
        'user_id',
        'indicaciones',
        'observaciones',
        'fecha',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    function paciente(){
        return $this->belongsTo(Paciente::class);
    }
    function user(){
        return $this->belongsTo(User::class);
    }
    function recetaDetalles(){
        return $this->hasMany(RecetaDetalle::class);
    }
    protected $appends = [
        'detalleText',
    ];
    function getDetalleTextAttribute(){
        $detalleText = '';
        foreach ($this->recetaDetalles as $detalle) {
            $detalleText .= $detalle->cantidad . ' ' . $detalle->unidad . ' de ' . $detalle->productoNombre . ' ' . $detalle->via . ' ' . $detalle->frecuencia . ' ' . $detalle->duracion . ' ' . $detalle->indicaciones . "\n". ",";
        }
        $detalleText = substr($detalleText, 0, -1);
        return $detalleText;
    }
}
