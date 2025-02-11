<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use phpDocumentor\Reflection\Types\Static_;

class PacienteVenta extends Model{
    use SoftDeletes;
    protected $fillable = ['paciente_id', 'venta_id', 'user_id', 'fecha', 'hora'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    protected $appends = ['nombre_completo'];

    public function getNombreCompletoAttribute(): string{
        $user = User::find($this->user_id);
        return $user->name;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($venta) {
            $venta->hora = now()->format('H:i');
        });
    }
    function user(){
        return $this->belongsTo(User::class);
    }
    function venta(){
        return $this->belongsTo(Venta::class);
    }

}
