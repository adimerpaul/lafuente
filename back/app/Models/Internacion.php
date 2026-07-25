<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Internacion extends Model
{
    protected $table = 'internaciones';

    protected $fillable = [
        'paciente_id',
        'user_id',
        'finalizado_user_id',
        'fecha_inicio',
        'fecha_finalizacion',
        'cama',
        'estado',
        'observacion',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_finalizacion' => 'datetime',
    ];

    protected $appends = ['dias_internado'];

    public function getDiasInternadoAttribute(): int
    {
        $inicio = Carbon::parse($this->fecha_inicio)->startOfDay();
        $fin = $this->fecha_finalizacion
            ? Carbon::parse($this->fecha_finalizacion)->startOfDay()
            : now()->startOfDay();

        return (int) $inicio->diffInDays($fin) + 1;
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function finalizadoPor()
    {
        return $this->belongsTo(User::class, 'finalizado_user_id');
    }
}
