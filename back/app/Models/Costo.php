<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Costo extends Model
{
    use SoftDeletes;

    protected $table = 'costos';

    protected $fillable = [
        'nombre',
        'icono',
        'color',
        'activo',
        'orden',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    protected $hidden = ['deleted_at'];

    public function aranceles()
    {
        return $this->belongsToMany(Arancel::class, 'costo_arancel');
    }
}
