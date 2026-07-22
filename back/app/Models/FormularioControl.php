<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormularioControl extends Model
{
    use SoftDeletes;

    protected $table = 'formularios_control';

    protected $fillable = [
        'paciente_id',
        'user_id',
        'fecha',
        'diagnostico',
        'detalle',
        'observaciones',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'detalle' => 'array',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
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
