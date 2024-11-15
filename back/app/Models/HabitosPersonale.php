<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HabitosPersonale extends Model{
    use HasFactory,SoftDeletes;
    protected $table = 'habitos_personales';
    protected $fillable = [
        'paciente_id',
        'fuma',
        'alcohol',
        'drogas',
        'zoonosis',
        'deportes',
        'vacunas',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    function paciente(){
        return $this->belongsTo(Paciente::class);
    }
}
