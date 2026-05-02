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
        'arancel_ids',
    ];

    protected $casts = [
        'monto' => 'float',
        'arancel_ids' => 'array',
    ];

    public function costo()
    {
        return $this->belongsTo(Costo::class);
    }

    public function cajaRecepcion()
    {
        return $this->belongsTo(CajaRecepcion::class);
    }
}
