<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SignosVitale extends Model{
    use SoftDeletes, HasFactory;
    protected $table = 'signos_vitales';
    protected $fillable = [
        'paciente_id',
        'user_id',
        'estado_general',
        'fc',
        'fr',
        'pa',
        'temperatura',
        'peso',
        'talla',
        'imc',
        'spo2',
        'glasgow',
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
}
