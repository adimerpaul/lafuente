<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AntecedentesFamiliare extends Model{
    use SoftDeletes,HasFactory;
    protected $table = 'antecedentes_familiares';
    protected $fillable = [
        'paciente_id',
        'user_id',
        'tuberculosis',
        'diabetes',
        'hipertension',
        'cardiopatia',
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
