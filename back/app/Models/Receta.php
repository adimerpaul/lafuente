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
}
