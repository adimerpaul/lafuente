<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model{
    use SoftDeletes;
    protected $fillable = ['nombre', 'ci', 'telefono', 'direccion'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
}
