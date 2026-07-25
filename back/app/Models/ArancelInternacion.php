<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ArancelInternacion extends Model
{
    use SoftDeletes;

    protected $table = 'arancel_internaciones';

    protected $fillable = [
        'categoria', 'grupo', 'nombre', 'detalle', 'tipo_precio', 'precio',
        'permite_precio_manual', 'activo',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'permite_precio_manual' => 'boolean',
        'activo' => 'boolean',
    ];
}
