<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InternacionArancel extends Model
{
    use SoftDeletes;

    protected $table = 'internacion_aranceles';

    protected $fillable = [
        'internacion_id', 'arancel_internacion_id', 'user_id', 'categoria',
        'nombre', 'tipo_precio', 'precio_unitario', 'cantidad', 'total',
        'fecha_hora', 'observacion',
    ];

    protected $casts = [
        'precio_unitario' => 'decimal:2',
        'cantidad' => 'decimal:2',
        'total' => 'decimal:2',
        'fecha_hora' => 'datetime',
    ];

    public function arancel()
    {
        return $this->belongsTo(ArancelInternacion::class, 'arancel_internacion_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
