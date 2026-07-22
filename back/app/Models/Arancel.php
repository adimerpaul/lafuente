<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Arancel extends Model
{
    use SoftDeletes;

    protected $table = 'aranceles';

    protected $fillable = [
        'codigo',
        'categoria',
        'nombre',
        'presentacion',
        'precio',
        'orden',
        'activo',
    ];

    protected $casts = [
        'precio' => 'float',
        'orden' => 'integer',
        'activo' => 'boolean',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
