<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PacienteAlta extends Model
{
    protected $table = 'paciente_altas';

    protected $fillable = [
        'paciente_id',
        'user_id',
        'accion',
        'estado_anterior',
        'estado_nuevo',
        'fecha_hora',
    ];

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
