<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CajaRecepcionCosto extends Model
{
    protected $table = 'caja_recepcion_costos';

    protected $fillable = [
        'caja_recepcion_id',
        'costo_id',
        'nombre',
        'monto',
        'doctor_porcentaje',
        'arancel_ids',
        'pagado',
        'pagado_at',
        'pagado_por_user_id',
    ];

    protected $casts = [
        'monto' => 'float',
        'doctor_porcentaje' => 'integer',
        'arancel_ids' => 'array',
        'pagado' => 'boolean',
        'pagado_at' => 'datetime',
    ];

    public function pagadoPor()
    {
        return $this->belongsTo(User::class, 'pagado_por_user_id');
    }

    public function costo()
    {
        return $this->belongsTo(Costo::class);
    }

    public function cajaRecepcion()
    {
        return $this->belongsTo(CajaRecepcion::class);
    }
}
