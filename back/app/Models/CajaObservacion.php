<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CajaObservacion extends Model
{
    protected $table = 'caja_observaciones';

    protected $fillable = [
        'caja_recepcion_id',
        'tipo',
        'observacion',
        'foto_path',
        'user_id',
    ];

    protected $hidden = ['updated_at'];

    protected $appends = ['user_name', 'foto_url'];

    public function cajaRecepcion()
    {
        return $this->belongsTo(CajaRecepcion::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getUserNameAttribute()
    {
        return $this->user?->name ?: '-';
    }

    public function getFotoUrlAttribute()
    {
        return $this->foto_path ? url('storage/'.$this->foto_path) : null;
    }
}
