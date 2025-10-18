<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model{
    //$table->string('nombre')->nullable();
    //            $table->string('especialidad')->nullable();
    //            $table->string('telefono')->nullable();
    //            $table->string('email')->nullable();
    //            $table->softDeletes();
    use SoftDeletes;
    protected $table = 'doctores';
    protected $fillable = [
        'nombre',
        'especialidad',
        'telefono',
        'email',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
