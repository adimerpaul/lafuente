<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Paciente extends Model{
    use SoftDeletes,HasFactory;
    protected $table = 'pacientes';
    protected $fillable = [
        'nombre',
        'apellido',
        'fecha_nacimiento',
        'identificacion',
        'edad',
        'sexo',
        'estado_civil',
        'direccion',
        'telefono',
        'fecha_creacion',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];
    protected $appends = [
        'nombre_completo',
    ];

    public function getNombreCompletoAttribute(): string{
        return "{$this->nombre} {$this->apellido}";
    }
}
