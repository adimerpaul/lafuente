<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HistorialMedico extends Model{
    use SoftDeletes, HasFactory;
    protected $table = 'historial_medicos';
    protected $fillable = [
        'paciente_id',
        'user_id',
        'fecha',
        'referido_de',
        'motivo_consulta',
        'enfermedad_actual',
        'alergias_conocidas',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
//    protected $casts = [
//        'fecha_consulta' => 'date',
//        'hora_consulta' => 'time',
//    ];
    public function paciente(){
        return $this->belongsTo(Paciente::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
