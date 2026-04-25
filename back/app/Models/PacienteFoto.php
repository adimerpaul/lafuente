<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PacienteFoto extends Model {
    protected $fillable = ['paciente_id', 'user_id', 'archivo'];

    public function paciente() {
        return $this->belongsTo(Paciente::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
