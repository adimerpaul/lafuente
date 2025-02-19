<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Factura extends Model{
    use SoftDeletes;
    protected $fillable = ['fecha', 'observacion', 'tipo', 'total', 'pagado', 'paciente_id', 'user_id'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
}
