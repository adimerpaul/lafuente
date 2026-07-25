<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivoFijoAsignacion extends Model
{
    protected $table = 'activo_fijo_asignaciones';

    protected $fillable = [
        'activo_fijo_id',
        'user_id',
        'asignado_por',
        'devuelto_por',
        'fecha_asignacion',
        'fecha_devolucion',
        'estado',
        'observacion',
        'observacion_devolucion',
    ];

    protected $casts = [
        'fecha_asignacion' => 'datetime:Y-m-d H:i:s',
        'fecha_devolucion' => 'datetime:Y-m-d H:i:s',
    ];

    public function activoFijo()
    {
        return $this->belongsTo(ActivoFijo::class);
    }

    public function funcionario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function asignador()
    {
        return $this->belongsTo(User::class, 'asignado_por');
    }

    public function receptorDevolucion()
    {
        return $this->belongsTo(User::class, 'devuelto_por');
    }
}
